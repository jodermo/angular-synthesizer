import { ChangeDetectorRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SynthesizerService {

  layers: AudioLayer[];
  synthesizers: Synthesizer[];

  constructor() {
  }

  addLayer() {
    const layer = new AudioLayer();
    this.layers.push(layer);
    return layer;
  }

}

export class AudioLayer {
  audioContext: AudioContext;

  constructor(public audio: HTMLAudioElement = null) {
    if (!this.audio) {
      this.audio = new Audio();
    }
    this.audioContext = new AudioContext();
  }

}

export class SynthesizerLayout {
  colors = {
    default: {
      main: '#00725f',
      secondary: '#00ffd9',
      light: '#cccccc',
      dark: '#222222'
    },
    hover: {
      main: '#00ffd9',
      secondary: '#00725f',
      light: '#fff',
      dark: '#6d6d6d'
    },
    active: {
      main: '#003c33',
      secondary: '#00725f',
      light: '#00ffd9',
      dark: '#003c33'
    }


  };
}

export class Synthesizer {

  restartOnTrigger = false;
  paused = true;
  isTone = false;
  metronome = false;
  volume = 1;
  release = 250;
  delay = 0;
  currentPitch = 0;
  currentTempo = 120;
  startTime = 0;
  currentTime = 0;
  currentNote = 'C';
  currentOctave = 1;
  totalBeat;
  currentBeat;
  beatString;


  manager = new SynthesizerManager(this);
  midi = new MIDIManager(this);
  callbacks: any = {};
  audioContext: AudioContext;
  oscs: OSC[] = [];
  lfos: LFO[] = [];
  sequencers: Sequencer[] = [];
  connectNode: any;

  constructor(public oscCount = 3, public lfoCount = 1, public sequencerCount = 1, private changeDetector: ChangeDetectorRef) {
    this.restart();
    // tslint:disable-next-line:new-parens
    this.audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext);
    for (let i = 0; i < this.oscCount; i++) {
      this.addOsc(i + 1);
    }
    for (let i = 0; i < this.lfoCount; i++) {
      this.addLfo(i + 1);
    }
    for (let i = 0; i < this.sequencerCount; i++) {
      this.addSequencer(i + 1);
    }
    if (this.oscs.length) {
      this.oscs[0].active = true;
    }
    this.manager.getLocalStorage();


  }

  valueChange() {
    if (this.changeDetector) {
      this.changeDetector.detectChanges();
    }
  }

  update() {
    for (const osc of this.oscs) {
      osc.update();
    }
    for (const lfo of this.lfos) {
      lfo.update();
    }
    for (const sequencer of this.sequencers) {
      sequencer.update();
    }
    this.do('update', this.currentTime);
  }

  addOsc(id = 0) {
    if (id === 0) {
      id = this.oscs.length + 1;
    }
    const osc = new OSC(this.audioContext, id);
    osc.synthesizer = this;
    this.oscs.push(osc);
    return osc;
  }

  addLfo(id = 0) {
    if (id === 0) {
      id = this.lfos.length + 1;
    }
    const lfo = new LFO(id);
    lfo.synthesizer = this;
    this.lfos.push(lfo);
    return lfo;
  }

  addSequencer(id = 0) {
    if (id === 0) {
      id = this.sequencers.length + 1;
    }
    const sequencer = new Sequencer(id);
    sequencer.synthesizer = this;
    sequencer.currentTime = this.currentTime;
    sequencer.currentBeat = this.currentBeat;
    this.sequencers.push(sequencer);
    return sequencer;
  }

  setRestart(restart = this.restartOnTrigger) {
    this.restartOnTrigger = restart;
    if (restart) {
      this.metronome = false;
    }
    this.restart();
  }

  play() {
    this.paused = false;
    this.timeUpdate();
    this.do('play', this.currentTime);
  }

  pause() {
    this.paused = true;
    this.timeUpdate();
    this.do('pause', this.currentTime);
  }

  startTone() {

    for (const osc of this.oscs) {
      osc.start();
    }
    this.timeUpdate();
    this.do('start', [this.currentNote, this.currentOctave]);
  }

  stopTone() {
    this.isTone = false;
    for (const osc of this.oscs) {
      osc.stop();
    }
    this.do('stop', [this.currentNote, this.currentOctave]);
  }

  playNote(note = this.currentNote, octave = this.currentOctave) {
    this.currentNote = note.toLowerCase();
    this.currentOctave = octave;

    if (this.restartOnTrigger && !this.isTone) {
      this.restart();
    }
    this.isTone = true;
    for (const osc of this.oscs) {
      osc.playNote([this.currentNote, octave]);
    }
    this.timeUpdate();
    this.do('playnote', [note, octave]);
  }

  triggerNote(note = 'C', octave = 1, delay = this.delay, release = this.release) {
    setTimeout(() => {
      this.playNote(note, octave);
      setTimeout(() => {
        this.stopTone();
      }, release);
    }, delay);
    this.do('triggernote', [note, octave, delay, release]);
  }


  restart() {
    this.startTime = Date.now();
    this.totalBeat = {
      1: 0,
      2: 0,
      4: 0,
      8: 0,
      16: 0,
      32: 0,
      64: 0
    };
    this.currentBeat = {
      '%': 0,
      1: 1,
      2: 1,
      4: 1,
      8: 1,
      16: 1,
      32: 1,
      64: 1
    };
    this.timeUpdate();
  }

  time() {
    this.timeUpdate();
    this.do('timechange', this.currentTime);
    return this.currentTime;
  }

  tempo(tempo = this.currentTempo) {
    this.currentTempo = tempo;
    this.do('tempochange', this.currentTempo);
    return this.currentTempo;
  }

  pitch(pitch = this.currentPitch) {
    this.currentPitch = pitch;
    for (const osc of this.oscs) {
      osc.pitch(this.currentPitch);
    }
    this.do('pitchchange', this.currentPitch);
    return this.currentPitch;
  }

  save() {
    this.manager.saveSynthesizer();
  }

  reset() {
    if (confirm('you want to reset modulation?')) {
      localStorage.removeItem('synthesizer-data');
      location.reload();
    }

  }

  timeUpdate() {
    if (!this.startTime) {
      this.startTime = Date.now();
    }
    this.currentTime = Date.now() - this.startTime;
    this.currentBeat['%'] = (((this.currentTime / this.currentTempo / 60) * 4) * 100) % 100;
    const sixteenFourth = Math.floor(this.currentTime / 60 * this.currentTempo / 64);
    if (this.totalBeat['64'] !== sixteenFourth) {
      this.beatUpdate(sixteenFourth);
    }


    if ((!this.paused && !this.restartOnTrigger) || this.isTone) {
      window.requestAnimationFrame(() => {
        this.timeUpdate();
      });
    }
    this.update();
  }

  beatUpdate(sixteenFourth) {

    this.totalBeat['64'] = sixteenFourth;
    const sixteenFourthBeat = Math.floor(this.totalBeat['64'] % 64);
    this.currentBeat['64'] = sixteenFourthBeat;
    this.triggerBeat()['64']();

    for (let i = 32; i > .5; i = i / 2) {

      const beat = Math.floor(this.totalBeat[i * 2] / 2);
      if (beat !== this.totalBeat[i]) {
        this.totalBeat[i] = beat;
        this.currentBeat[i] = Math.floor(beat % i) + 1;
        this.triggerBeat()[i]();
      }
    }
    this.beatString = this.totalBeat['1'] + ': ' + this.currentBeat['2'] + '/2 ' + this.currentBeat['4'] + '/4 ' + this.currentBeat['8'] + '/8 ' + this.currentBeat['16'] + '/16 ' + this.currentBeat['32'] + '/32 ' + this.currentBeat['64'] + '/64';
    this.beatString += '  ' + this.currentTime / 1000 + 's ' + Math.floor(this.currentBeat['%']) + '%';

  }

  triggerBeat() {
    return {
      64: () => {

      },
      32: () => {

      },
      16: () => {

      },
      8: () => {
        if (this.metronome) {
          this.triggerNote('C', 1, 0, 60000 / this.currentTempo / 4);
        }
      },
      4: () => {
        if (this.metronome) {
          this.triggerNote('C', 2, 0, 60000 / this.currentTempo / 4);
        }
      },
      2: () => {

      },
      1: () => {
        if (this.metronome) {
          this.triggerNote('C', 3, 0, 60000 / this.currentTempo / 4);
        }
      }
    };
  }

  on(callback, event) {
    if (!this.callbacks[callback]) {
      this.callbacks[callback] = [];
    }
    this.callbacks[callback].push(event);
    return event;
  }

  do(callback, data: any = null) {
    if (this.callbacks[callback]) {
      for (const event of this.callbacks[callback]) {
        event(data);
      }
    }
  }

  removeCallback(callback, event) {
    if (this.callbacks[callback]) {
      for (let i = 0; i < this.callbacks[callback].length; i++) {
        if (this.callbacks[callback][i] === event) {
          this.callbacks[callback].splice(i, 1);
        }
      }
    }
  }

}


export class OSC {
  type = 'osc';
  noteValues = {
    c: [16.35, 32.70, 65.41, 130.81, 261.63, 523.25, 1046.50, 2093.00, 4186.01],
    c2: [17.32, 34.65, 69.30, 138.59, 277.18, 554.37, 1108.73, 2217.46, 4434.92],
    d: [18.35, 36.71, 73.42, 146.83, 293.66, 587.33, 1174.66, 2349.32, 4698.64],
    d2: [19.45, 38.89, 77.78, 155.56, 311.13, 622.25, 1244.51, 2489.02, 4978.03],
    e: [20.60, 41.20, 82.41, 164.81, 329.63, 659.26, 1318.51, 2637.02],
    f: [21.83, 43.65, 87.31, 174.61, 349.23, 698.46, 1396.91, 2793.83],
    f2: [23.12, 46.25, 92.50, 185.00, 369.99, 739.99, 1479.98, 2959.96],
    g: [24.50, 49.00, 98.00, 196.00, 392.00, 783.99, 1567.98, 3135.96],
    g2: [25.96, 51.91, 103.83, 207.65, 415.30, 830.61, 1661.22, 3322.44],
    a: [27.50, 55.00, 110.00, 220.00, 440.00, 880.00, 1760.00, 3520.00],
    b: [29.14, 58.27, 116.54, 233.08, 466.16, 932.33, 1864.66, 3729.31],
    h: [30.87, 61.74, 123.47, 246.94, 493.88, 987.77, 1975.53, 3951.07]
  };

  waveforms = [
    'sine',
    'square',
    'sawtooth',
    'triangle'
  ];
  osc;
  currentNote;
  currentFrequency;
  currentTimeOffset = 0;
  currentPitch = 0;
  pitchAmount = 12;
  currentTempo = 120;
  currentGain = 1;
  currentTime = 0;
  currentWaveform = this.waveforms[0];
  audioLoadStart;
  audioLoadOffset;


  controlViews = ['compressor', 'filter'];
  controlView = this.controlViews[0];

  synthesizer: Synthesizer;

  effects: AudioEffects;
  compressor: AudioEffectNode;

  volume = 1;
  active = false;
  started = false;
  ready = false;

  constructor(public audioContext: AudioContext, public id = null, waveform = 'sine') {

    this.osc = this.audioContext.createOscillator();
    this.effects = new AudioEffects(this.audioContext, null, this);
    this.compressor = this.effects.compressor;
    this.update();
    // tslint:disable-next-line:forin
    this.ready = true;

  }

  update() {

    this.pitch();
    this.waveform();
    this.time();
    this.timeOffset();
    this.gain();
    this.gainType();
    this.pan();
  }

  valueChange() {
    if (this.synthesizer) {
      this.synthesizer.valueChange();
    }

  }

  pitch(pitch = this.currentPitch) {
    this.currentPitch = pitch;
    this.frequency();
  }

  playNote(noteArr = this.currentNote) {
    this.frequency(this.noteToFrequency(noteArr));
    this.start();
    return this.currentNote = noteArr;
  }

  waveform(waveform = this.currentWaveform) {
    return this.osc.type = this.currentWaveform = waveform;
  }

  frequency(frequency = this.noteToFrequency(this.currentNote || ['C', 1])) {
    this.currentFrequency = frequency;
    const pitchedFrequency = this.currentFrequency + (this.currentPitch * (880 / 12) * this.pitchAmount);
    this.osc.frequency.setValueAtTime(pitchedFrequency, this.audioContext.currentTime + this.currentTimeOffset);
    return this.currentFrequency;
  }

  time(time = this.currentTime) {
    return this.currentTime = time;
  }

  timeOffset(offset = this.currentTimeOffset) {
    this.currentTimeOffset = offset;
    this.frequency();
  }

  effect(name, value = this.effects.get(name)) {
    return this.effects.set(name, value);
  }

  effectNodes() {
    const nodes: AudioEffectNode[] = [];
    for (const key in this.effects) {
      if (key && this.effects[key] && key !== 'compressor' && key !== 'source' && this.effects[key].nodeType) {
        const node = this.effects[key];
        if (node) {
          nodes.push(node);
        }
      }
    }
    return nodes;
  }


  gain(value = this.gainValue(this.currentGain)) {
    if (this.synthesizer) {
      this.volume = this.synthesizer.volume;
    }
    if (!value) {
      value = this.effects.gain.value(value);
    }
    value += (this.volume - 1);
    return this.currentGain = this.gainValue(value);
  }

  gainValue(value) {
    return this.effects.gain.value(value) - (this.volume - 1);
  }

  gainType(type = this.effects.gain.type()) {
    return this.effects.gain.type(type);
  }

  pan(value = this.effects.pan.value()) {
    return this.effects.pan.value(value);
  }

  start(force = false) {
    if (this.active || force) {
      if (!this.started && this.osc) {
        this.osc.start();
        this.started = true;
      } else {
        this.audioContext.resume();
      }
      this.active = true;
    }
    for (const node of this.effectNodes()) {
      if (node.start) {
        node.start();
      }
    }
    if (this.compressor) {
      this.compressor.start();
    }

  }

  stop(deactivate = false) {
    for (const node of this.effectNodes()) {
      if (node.stop) {
        node.stop();
      }
    }
    if (deactivate) {
      this.active = false;
    }
    this.compressor.stop();
  }

  toggle() {
    if (!this.active) {
      this.start(true);
    } else {
      this.stop(true);
    }
  }

  toggleActive() {
    if (!this.active) {
      this.active = true;
    } else {
      this.active = false;
      this.stop();
    }
  }

  noteToFrequency(noteArr) {
    const note = noteArr[0].replace('#', '2').toLowerCase();
    const octave = noteArr[1] || 1;
    return this.noteValues[note][octave];
  }

  remove() {
    if (this.synthesizer && confirm('are you sure?')) {
      for (let i = 0; i < this.synthesizer.oscs.length; i++) {
        if (this.synthesizer.oscs[i] === this) {
          return this.synthesizer.oscs.splice(i, 1);
        }

      }
    }
  }
}


export class SynthesizerEffect {
  type = 'effect';
  active = true;
  synthesizer: Synthesizer;
  targetNodes: AudioEffectNode[] = [];

  currentTime = 0;
  currentValue = 0;
  currentRate = 1;
  currentAmplitude = 100;
  currentMaxValue = 100;
  reverse = false;

  constructor(public id = null) {
  }

  update() {
    if (this.synthesizer) {
      this.currentTime = this.synthesizer.currentTime;
    }
    this.onUpdate();
    this.updateValue();
    this.updateTargetNodes();
  }

  onUpdate() {

  }

  updateTargetNodes(value: number = this.currentValue) {

    if (value && this.targetNodes.length) {
      for (const node of this.targetNodes) {
        if (node.addValue) {
          node.addValue(node.currentValue + value);
        }
      }
    }
  }


  updateValue() {
    if (this.synthesizer && this.synthesizer.currentBeat) {
      this.currentValue = this.percentToValue(this.synthesizer.currentBeat['%']);
    }
    return this.currentValue;
  }

  rate(rate = this.currentRate) {
    return this.currentRate = rate;
  }

  amplitude(amplitude = this.currentAmplitude) {
    return this.currentAmplitude = amplitude;
  }

  percentToValue(percent: number) {
    return this.currentValue / percent * 100;
  }

  toggleActive() {
    if (!this.active) {
      this.active = true;
    } else {
      this.active = false;
    }
  }

  remove() {

  }

}

export class OSCSaveData {
  currentWaveform = 'sine';
  active = false;
}

export class LFO extends SynthesizerEffect {
  // Low Frequency OSC
  type = 'lfo';
  waveforms = [
    'sine',
    'square',
    'sawtooth',
    'triangle'
  ];
  currentWaveform = this.waveforms[0];

  onUpdate() {
    this.waveform();
  }

  waveform(waveform = this.currentWaveform) {
    return this.currentWaveform = waveform;
  }

  percentToValue(percent: number) {
    let value = Math.sin(percent / 100 * this.currentRate * Math.PI * 2) * this.currentAmplitude;
    if (this.currentWaveform === 'square') {
      if (value < 0) {
        value = -this.currentAmplitude;
      } else {
        value = this.currentAmplitude;
      }
    } else if (this.currentWaveform === 'sawtooth') {
      value = this.currentAmplitude - (percent * this.currentRate % 100) * 2 * this.currentAmplitude / this.currentMaxValue;
    } else if (this.currentWaveform === 'triangle') {
      value = ((this.currentRate) * percent) % 100 * this.currentAmplitude / this.currentMaxValue * 4;
      if (value > this.currentAmplitude) {
        // tslint:disable-next-line:max-line-length
        value = this.currentAmplitude - (((this.currentRate) * percent) % 100 * this.currentAmplitude / this.currentMaxValue * 4) + this.currentAmplitude;
      }
      if (value < -this.currentAmplitude) {
        value = -value - this.currentAmplitude * 2;
      }
    }
    return value;
  }

  remove() {
    if (this.synthesizer && confirm('are you sure?')) {
      for (let i = 0; i < this.synthesizer.lfos.length; i++) {
        if (this.synthesizer.lfos[i] === this) {
          return this.synthesizer.lfos.splice(i, 1);
        }

      }
    }
  }
}

export class LFOSaveData {
  currentWaveform = 'sine';
  active = false;
  amplitude = 100;
}

export class Sequencer extends SynthesizerEffect {
  // Step Sequencer
  type = 'seq';
  steps = 4;
  stepsMin = 4;
  stepsMax = 64;
  ready = false;
  values = [];
  allValues = [];

  currentTime = 0;
  currentBeat;

  constructor(public id = null) {
    super(id);
    this.update();
    this.ready = true;
  }

  onUpdate() {
    if (this.synthesizer) {
      this.currentTime = this.synthesizer.currentTime;
      this.currentBeat = this.synthesizer.currentBeat;
    }
    this.updateValues();
    this.updateTargetNodes();
  }

  updateValues() {
    if (this.steps > this.values.length) {
      const length = this.steps - this.values.length;
      for (let i = 0; i < length; i++) {
        const value = this.sequenceValue(this.values.length - 1 + i);
        this.values.push(value);
      }
    } else if (this.steps < this.values.length) {
      const length = this.values.length - this.steps;
      this.values.splice(this.steps - 1, length);
    }
  }

  sequenceValue(int, value: number = this.allValues[int] || 0) {
    this.allValues[int] = value || 0;
    this.values[int] = this.allValues[int];
    return this.values[int];
  }

  percentToValue(percent: number) {
    const int = Math.round(this.values.length / 100 * percent);
    return this.values[int];
  }

  remove() {
    if (this.synthesizer && confirm('are you sure?')) {
      for (let i = 0; i < this.synthesizer.sequencers.length; i++) {
        if (this.synthesizer.sequencers[i] === this) {
          return this.synthesizer.sequencers.splice(i, 1);
        }

      }
    }
  }
}

export class SequencerSaveData {
  currentWaveform = 'sine';
  active = false;
  amplitude = 100;
}

export class SequencerValue {
  int: number;
  value: number;
}

export class AudioEffects {

  gain: AudioEffectNode;
  pan: AudioEffectNode;
  distortion: AudioEffectNode;
  biquadFilter: AudioEffectNode;
  convolver: AudioEffectNode;
  delay: AudioEffectNode;

  compressor: AudioEffectNode;
  source;


  threshold = {
    min: -100,
    max: 0,
    step: 1,
    value: (value = this.threshold.currentValue) => {
      this.compressor.do('valueChange', 'threshold', value);
      return this.threshold.currentValue = value;
    }
  };

  knee = {
    min: 0,
    max: 1,
    step: .01,
    value: (value = this.compressor.value('knee')) => {
      this.compressor.value('knee', value);
      this.compressor.do('valueChange', 'knee', value);
      return this.compressor.currentValue;
    }
  };

  ratio = {
    min: 1,
    max: 20,
    step: 1,
    value: (value = this.compressor.value('ratio')) => {
      this.compressor.value('ratio', value);
      this.compressor.do('valueChange', 'ratio', value);
      return this.compressor.currentValue;
    }
  };

  attack = {
    min: 0,
    max: 1,
    step: .01,
    value: (value = this.compressor.value('attack')) => {
      this.compressor.value('attack', value);
      this.compressor.do('valueChange', 'attack', value);
      return this.compressor.currentValue;
    },
    connect: () => {
      return this.compressor.connect();
    },
    disconnect: (value = this.compressor.value('attack')) => {
      return this.compressor.disconnect();
    }
  };

  release = {
    min: 0,
    max: 1,
    step: .01,
    value: (value = this.compressor.value('release')) => {
      this.compressor.value('release', value);
      this.compressor.do('valueChange', 'release', value);
      return this.compressor.currentValue;
    }
  };

  constructor(public audioContext, public media: HTMLMediaElement = null, osc: OSC) {
    if (this.media) {
      this.source = this.audioContext.createMediaElementSource(this.media);
    }
    this.gain = new AudioEffectNode(this.audioContext, 'gain', osc);
    this.pan = new AudioEffectNode(this.audioContext, 'pan', osc);
    this.distortion = new AudioEffectNode(this.audioContext, 'distortion', osc);
    this.biquadFilter = new AudioEffectNode(this.audioContext, 'biquadFilter', osc);
    this.convolver = new AudioEffectNode(this.audioContext, 'convolver', osc);
    this.delay = new AudioEffectNode(this.audioContext, 'delay', osc);
    this.compressor = new AudioEffectNode(this.audioContext, 'compressor', osc);

    this.threshold = new AudioEffectNode(this.audioContext, 'threshold', osc, this.threshold);
    this.knee = new AudioEffectNode(this.audioContext, 'knee', osc, this.knee);
    this.ratio = new AudioEffectNode(this.audioContext, 'ratio', osc, this.ratio);
    this.attack = new AudioEffectNode(this.audioContext, 'attack', osc, this.attack);
    this.release = new AudioEffectNode(this.audioContext, 'release', osc, this.release);
  }

  set(effectName, value) {
    if (this[effectName] && this[effectName].value) {
      return this[effectName].value(value);
    }
    return null;
  }

  get(effectName) {
    if (this[effectName] && this[effectName].value) {
      return this[effectName].value();
    }
    return null;
  }


}

export class AudioEffectNode {

  audioNode;
  source;
  types = [];
  min = 0;
  max = 1;
  step = .01;
  default = 0;
  currentValue = this.default;
  active = false;
  connected = false;
  oscConnected = false;
  sourceConnected = false;
  callbacks = {
    valueChange: []
  };
  nodes: SynthesizerNode[] = [];

  value: any = (value = this.currentValue, options = null) => {
    this.currentValue = value;
    this.do('valueChange', value, options);
    return this.currentValue;
  };

  connect: any = (force = false) => {
    if (this.audioNode && !this.connected && (this.active || force)) {
      if (this.source && this.source.connect) {
        if (this.sourceConnected) {
          this.source.disconnect(this.audioNode);
          this.sourceConnected = false;
        }
        this.source.connect(this.audioContext.destination);
      }
      if (this.osc) {
        this.osc.osc.connect(this.audioNode);
        this.oscConnected = true;
      }
      if (this.audioContext) {
        this.audioNode.connect(this.audioContext.destination);
      }
      this.connected = true;
      this.active = true;
    } else if (!this.active) {
      this.disconnect();
    }
  };

  disconnect: any = (force = false) => {
    if (this.osc && this.oscConnected) {
      this.osc.osc.disconnect(this.audioNode);
      this.oscConnected = false;
    }
    if (this.source && this.sourceConnected) {
      this.source.disconnect(!this.audioContext.destination);
      this.source.connect(this.audioNode);
      this.sourceConnected = true;
    }
    if (this.connected && this.audioContext) {
      this.audioNode.disconnect(this.audioContext.destination);
    }
    if (force) {
      this.active = false;
    }
    this.connected = false;
  };

  constructor(public audioContext: AudioContext, public nodeType: string, public osc: OSC = null, effectOptions: any = null) {
    if (nodeType === 'gain') {
      this.audioNode = this.audioContext.createGain();
      this.min = 0;
      this.max = 1;
      this.step = 0.01;
      this.default = 1;
      this.on('valueChange', (value = this.currentValue, options = null) => {
        this.audioNode.gain.value = value;
        return this.currentValue = value;
      });
    }

    if (nodeType === 'pan') {
      this.audioNode = this.audioContext.createStereoPanner();
      this.types = ['sine'];
      this.min = -1;
      this.max = 1;
      this.step = 0.01;
      this.default = 0;
      this.on('valueChange', (value = this.currentValue, options = null) => {
        this.audioNode.pan.setValueAtTime(value, this.audioContext.currentTime);
        return this.currentValue = value;
      });
    }

    if (nodeType === 'distortion') {
      const makeDistortionCurve = (amount = 50) => {
        const nSamples = 44100;
        const curve = new Float32Array(nSamples);
        const deg = Math.PI / 180;
        let x;
        for (let i = 0; i < nSamples; i++) {
          x = i * 2 / nSamples - 1;
          curve[i] = (3 + amount) * x * 20 * deg / (Math.PI + amount * Math.abs(x));
        }
        return curve;
      };
      this.audioNode = this.audioContext.createWaveShaper();
      this.min = 0;
      this.max = 10000;
      this.step = 1;
      this.default = 0;
      this.on('valueChange', (value = this.currentValue, options = null) => {
        this.audioNode.curve = makeDistortionCurve(value);
        this.audioNode.oversample = '4x';
        return this.currentValue = value;
      });
    }

    if (nodeType === 'biquadFilter') {
      this.audioNode = this.audioContext.createBiquadFilter();
      this.types = ['lowshelf'];
      this.min = 0;
      this.max = 22050;
      this.step = 1;
      this.default = 3000;
      this.on('valueChange', (value = this.currentValue, options = null) => {
        this.audioNode.frequency.setValueAtTime(value, this.audioContext.currentTime);
        return this.currentValue = value;
      });
    }

    if (nodeType === 'convolver') {
      this.audioNode = this.audioContext.createConvolver();
    }

    if (nodeType === 'delay') {
      this.audioNode = this.audioContext.createDelay();
      this.min = 0;
      this.max = 1;
      this.step = .01;
      this.default = 0;
      this.on('valueChange', (value = this.currentValue, options = null) => {
        this.audioNode.delayTime.setValueAtTime(value, this.audioContext.currentTime);
      });
    }

    if (nodeType === 'compressor') {
      this.audioNode = this.audioContext.createDynamicsCompressor();
      this.min = 1;
      this.max = 20;
      this.step = .1;
      this.default = 1;
      this.on('valueChange', (type, value) => {
        if (this.audioNode[type]) {
          this.audioNode[type].setValueAtTime(value, this.audioContext.currentTime);
        }
      });
    }
    if (effectOptions) {
      // tslint:disable-next-line:forin
      for (const key in effectOptions) {
        this[key] = effectOptions[key];
        // console.log(nodeType, key, effectOptions[key]);
      }
    }
    this.on('valueChange', (value) => {
      if (this.osc) {
        this.osc.valueChange();
      }
    });
    this.value(this.default);
    this.connect();
    this.disconnect();
  }

  addValue(value: number) {
    value = value * (this.max - this.min) / 100;
    value = this.currentValue + value;
    if (value > this.min && value < this.max) {
      this.value(value);
    }
    return value;
  }

  type(type = this.audioNode.type) {
    for (const available of this.types) {
      if (type === available) {
        this.audioNode.type = type;
      }
    }
    return this.audioNode.type;
  }

  start() {
    this.connect(true);
  }

  stop() {
    this.disconnect(true);
  }


  on(callback, event) {
    if (this.callbacks[callback]) {
      this.callbacks[callback].push(event);
    }
  }

  do(callback, data: any = null, options: any = null) {
    if (this.callbacks[callback]) {
      for (const event of this.callbacks[callback]) {
        event(data, options);
      }
    }
  }

}

export class SynthesizerNode {
  type: string;
  source: SynthesizerEffect;
  value = null;

  constructor() {
  }

  change(value = this.value) {
    this.value = value || 0;
  }

  update() {
    if (this.source && this.source.synthesizer && this.source.synthesizer.currentBeat) {
      this.value = this.source.percentToValue(this.source.synthesizer.currentBeat['%']);
    }
  }

  clear() {
    if (confirm('clear connections')) {
      this.type = null;
      this.source = null;
      this.value = null;
    }
  }

}

export class SynthesizerSaveData {
  volume = 1;
  release = 250;
  delay = 0;

  oscs: any[] = [];
  lfos: any[] = [];
  sequencers: any[];
}

export class SynthesizerManager {
  loading = false;
  saving = false;

  constructor(public synthesizer: Synthesizer) {

  }


  loadSynthesizer(saveData: SynthesizerSaveData) {
    for (const key in saveData) {
      if (key === 'oscs') {
        let osc: OSC;
        for (let i = 0; i < saveData[key].length; i++) {
          if (!this.synthesizer.oscs[i]) {
            osc = this.synthesizer.addOsc(i + 1);
          }
          // tslint:disable-next-line:forin
          for (const oscKey in saveData[key][i]) {
            this.synthesizer.oscs[i][oscKey] = saveData[key][i][oscKey];
          }
          this.synthesizer.oscs[i].update();
        }
      } else if (key === 'lfos') {
        let lfo: LFO;
        for (let i = 0; i < saveData[key].length; i++) {
          if (!this.synthesizer.lfos[i]) {
            lfo = this.synthesizer.addLfo(i + 1);
          }
          // tslint:disable-next-line:forin
          for (const lfoKey in saveData[key][i]) {
            this.synthesizer.lfos[i][lfoKey] = saveData[key][i][lfoKey];
          }
          this.synthesizer.lfos[i].update();
        }
      } else if (key === 'sequencer') {
        let sequencer: Sequencer;
        for (let i = 0; i < saveData[key].length; i++) {
          if (!this.synthesizer.lfos[i]) {
            sequencer = this.synthesizer.addSequencer(i + 1);
          }
          // tslint:disable-next-line:forin
          for (const sequencerKey in saveData[key][i]) {
            this.synthesizer.sequencers[i][sequencerKey] = saveData[key][i][sequencerKey];
          }
          this.synthesizer.sequencers[i].update();
        }
      } else {
        this.synthesizer[key] = saveData[key];
      }
    }
    this.synthesizer.do('onload', saveData);
  }

  saveSynthesizer() {
    if (!this.saving && confirm('You want to save this modulation?')) {
      this.saving = true;

      const saveData = new SynthesizerSaveData();
      for (const key in saveData) {
        if (key !== 'lfos' && key !== 'oscs') {
          saveData[key] = this.synthesizer[key];
        }
      }
      for (const osc of this.synthesizer.oscs) {
        const saveDataOsc = new OSCSaveData();
        // tslint:disable-next-line:forin
        for (const key in saveDataOsc) {
          saveDataOsc[key] = osc[key];
        }
        saveData.oscs.push(saveDataOsc);
      }
      for (const lfo of this.synthesizer.lfos) {
        const saveDataLfo = new LFOSaveData();
        // tslint:disable-next-line:forin
        for (const key in saveDataLfo) {
          saveDataLfo[key] = lfo[key];
        }
        saveData.lfos.push(saveDataLfo);
      }
      this.saveLocalStorage(saveData);
      this.synthesizer.do('onsave', saveData);
      alert('Modulation saved');
    }

  }

  getLocalStorage() {
    let savedData: any = localStorage.getItem('synthesizer-data');
    if (savedData) {
      savedData = JSON.parse(savedData);
      const saveData = new SynthesizerSaveData();
      for (const key in savedData) {
        if (key !== 'lfos' && key !== 'oscs') {
          saveData[key] = savedData[key];
        }
      }
      if (savedData.oscs) {
        for (const osc of savedData.oscs) {
          const saveDataOsc = new OSCSaveData();
          // tslint:disable-next-line:forin
          for (const key in saveDataOsc) {
            saveDataOsc[key] = osc[key];
          }
          saveData.oscs.push(saveDataOsc);
        }
      }
      if (savedData.oscs) {
        for (const lfo of savedData.lfos) {
          const saveDataLfo = new LFOSaveData();
          // tslint:disable-next-line:forin
          for (const key in saveDataLfo) {
            saveDataLfo[key] = lfo[key];
          }
          saveData.lfos.push(saveDataLfo);
        }
      }
      this.loadSynthesizer(savedData);
    }
  }

  saveLocalStorage(saveData) {
    localStorage.setItem('synthesizer-data', JSON.stringify(saveData));
  }

  clearLocalStorage() {
    localStorage.removeItem('synthesizer-data');
  }

}

export class MIDIManager {

  inputs;
  outputs;
  inputControllers: MIDIController[] = [];
  outputControllers: MIDIController[] = [];

  constructor(public synthesizer) {
    if ((navigator as any).requestMIDIAccess) {
      (navigator as any).requestMIDIAccess().then((e) => {
        this.onMIDISuccess(e);
      }, this.onMIDIFailure);
    } else {
      this.onMIDIFailure();
    }
  }

  onMIDISuccess(midiAccess) {
    this.inputs = midiAccess.inputs;
    this.outputs = midiAccess.outputs;
    for (const input of midiAccess.inputs.values()) {
      this.updateMidiInput(input);
    }
    for (const output of midiAccess.outputs.values()) {
      this.updateMidiOutput(output);
    }
    midiAccess.onstatechange = (e) => {
      console.log(e);
      this.updateMidiInput(e.port);
    };
  }

  updateMidiInput(input) {
    let exist = false;
    for (const controller of this.inputControllers) {
      if (controller.id === input.id) {
        controller.name = name;
        controller.input = input;
        exist = true;
      }
    }
    if (!exist) {
      this.inputControllers.push(new MIDIController(input, this.synthesizer));
    }
  }

  updateMidiOutput(output) {
    let exist = false;
    for (const controller of this.inputControllers) {
      if (controller.id === output.id) {
        controller.name = name;
        controller.input = output;
        exist = true;
      }
    }
    if (!exist) {
      this.outputControllers.push(new MIDIController(output, this.synthesizer));
    }
  }

  onMIDIFailure() {
    console.log('no midi support');
  }

}

export class MIDIController {
  id;
  name;
  active = false;
  callbacks: any = {};
  keysPressed = 0;

  midiValues = {
    c: [24, 36, 48, 60, 72, 523.25, 1046.50, 2093.00, 4186.01],
    c2: [25, 37, 49, 61, 73, 554.37, 1108.73, 2217.46, 4434.92],
    d: [26, 38, 50, 62, 293.66, 587.33, 1174.66, 2349.32, 4698.64],
    d2: [27, 39, 51, 63, 311.13, 622.25, 1244.51, 2489.02, 4978.03],
    e: [28, 40, 52, 64, 329.63, 659.26, 1318.51, 2637.02],
    f: [29, 41, 53, 65, 349.23, 698.46, 1396.91, 2793.83],
    f2: [30, 42, 54, 66, 369.99, 739.99, 1479.98, 2959.96],
    g: [31, 43, 55, 67, 392.00, 783.99, 1567.98, 3135.96],
    g2: [32, 44, 56, 68, 415.30, 830.61, 1661.22, 3322.44],
    a: [33, 45, 57, 69, 440.00, 880.00, 1760.00, 3520.00],
    b: [34, 46, 58, 70, 466.16, 932.33, 1864.66, 3729.31],
    h: [35, 47, 59, 71, 493.88, 987.77, 1975.53, 3951.07]
  };

  constructor(public input, public synthesizer: Synthesizer = null) {
    this.id = input.id;
    this.name = input.name;
    this.input.onmidimessage = (e) => {
      if (this.active) {
        this.getMIDIMessage(e);
      }
    };
    this.getLocalStorage();
  }

  setActive() {
    if (!this.active) {
      if (!this.isInLocalStorage()) {
        this.saveToLocalStorage();
      }
      this.active = true;
    }
  }

  setInactive() {
    this.active = false;
    this.isInLocalStorage(true);
  }

  toggleActive() {
    if (!this.active) {
      this.setActive();
    } else {
      this.setInactive();
    }
  }

  saveToLocalStorage() {
    let activeControllers: any = localStorage.getItem('active-midi-controller');
    if (activeControllers) {
      activeControllers = JSON.parse(activeControllers);
    } else {
      activeControllers = [];
    }
    activeControllers.push({id: this.input.id, name: this.input.name});
    localStorage.setItem('active-midi-controller', JSON.stringify(activeControllers));
  }

  isInLocalStorage(removeAndSave = false) {
    let activeControllers: any = localStorage.getItem('active-midi-controller');
    if (activeControllers) {
      activeControllers = JSON.parse(activeControllers);
    } else {
      activeControllers = [];
    }
    for (let i = 0; i < activeControllers.length; i++) {
      if (activeControllers[i].id === this.input.id && activeControllers[i].name === this.input.name) {
        if (removeAndSave) {
          activeControllers.splice(i, 1);
          localStorage.setItem('active-midi-controller', JSON.stringify(activeControllers));
        }
        return true;
      }
    }
    return false;
  }

  getLocalStorage() {
    let activeControllers: any = localStorage.getItem('active-midi-controller');
    if (activeControllers) {
      activeControllers = JSON.parse(activeControllers);
      for (const controller of activeControllers) {
        if (controller.id === this.input.id && controller.name === this.input.name) {
          return this.setActive();
        }

      }
      return this.setInactive();
    }
  }

  getMIDIMessage(message) {
    const command = message.data[0];
    const note = message.data[1];
    const velocity = (message.data.length > 2) ? message.data[2] : 0;
    // console.log('command', command);
    // console.log('note', note);
    // console.log('velocity', velocity);
    switch (command) {
      case 144:
        if (velocity > 0) {
          this.keyDown(note, velocity);
        } else {
          this.keyUp(note);
        }
        break;
      case 128:
        this.keyUp(note);
        break;
      case 224:
        this.pitchChange(note, velocity);
        break;
    }
  }

  keyDown(midiNumber, velocity) {
    this.keysPressed++;
    // tslint:disable-next-line:forin
    for (const note in this.midiValues) {
      for (let i = 0; i < this.midiValues[note].length; i++) {
        if (midiNumber === this.midiValues[note][i]) {
          this.playMidiNote(note, i + 1);
        }
      }
    }
  }

  keyUp(midiNumber) {
    this.keysPressed--;
    if (this.keysPressed <= 0) {
      if (this.synthesizer) {
        this.synthesizer.stopTone();
      }
    }
  }

  playMidiNote(note, octave) {
    if (this.synthesizer) {
      this.synthesizer.playNote(note, octave);
    }
  }

  pitchChange(note, velocity) {
    const pitch = note - velocity;
    // this.synthesizer.pitch(pitch / 64)
  }

  on(callback, event) {
    if (!this.callbacks[callback]) {
      this.callbacks[callback] = [];
    }
    this.callbacks[callback].push(event);
  }

  do(callback, data) {
    if (this.active && this.callbacks[callback]) {
      for (const event of this.callbacks[callback]) {
        event(data);
      }
    }
  }
}
