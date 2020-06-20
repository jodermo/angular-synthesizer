import { Injectable } from '@angular/core';

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

  addSynthesizer(oscCount = 3) {
    const synthesizer = new Synthesizer(oscCount);
    this.synthesizers.push(synthesizer);
    return synthesizer;
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

export class Synthesizer {
  audioContext: AudioContext;
  oscs: OSC[] = [];
  lfos: LFO[] = [];
  connectNode: any;
  volume = 1;
  release = 250;
  delay = 0;
  currentPitch = 0;
  currentTempo = 120;
  currentTime = 0;
  currentNote = 'C';
  currentOctave = 1;
  manager = new SynthesizerManager(this);
  midi = new MIDIManager(this);
  callbacks: any = {};

  constructor(public oscCount = 3, public lfoCount = 3) {
    this.audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext);
    for (let i = 0; i < this.oscCount; i++) {
      this.addOsc(i + 1);
    }
    for (let i = 0; i < this.lfoCount; i++) {
      this.addLfo(i + 1);
    }
    if (this.oscs.length) {
      this.oscs[0].active = true;
    }
    this.manager.getLocalStorage();
  }


  addOsc(id = 0) {
    const osc = new OSC(this.audioContext, id);
    osc.synthesizer = this;
    this.oscs.push(osc);
    return osc;
  }

  addLfo(id = 0) {
    const lfo = new LFO(id);
    lfo.synthesizer = this;
    this.lfos.push(lfo);
    return lfo;
  }

  start() {
    for (const osc of this.oscs) {
      osc.start();
    }
    this.do('start', [this.currentNote, this.currentOctave]);
  }

  stop() {
    for (const osc of this.oscs) {
      osc.stop();
    }
    this.do('stop', [this.currentNote, this.currentOctave]);
  }

  playNote(note = this.currentNote, octave = this.currentOctave) {
    this.currentNote = note.toLowerCase();
    this.currentOctave = octave;
    for (const osc of this.oscs) {
      osc.playNote([this.currentNote, octave]);
    }
    this.do('playnote', [note, octave]);
  }

  triggerNote(note = 'C', octave = 1, delay = this.delay, release = this.release) {
    setTimeout(() => {
      this.playNote(note, octave);
      setTimeout(() => {
        this.stop();
      }, release);
    }, delay);
    this.do('triggernote', [note, octave, delay, release]);
  }

  time(time = this.currentTime) {
    this.currentTime = time
    this.do('timechange', this.currentTime);
    return this.currentTime;
  }

  tempo(tempo = this.currentTempo) {
    this.currentTempo = tempo
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

  on(callback, event) {
    if (!this.callbacks[callback]) {
      this.callbacks[callback] = [];
    }
    this.callbacks[callback].push(event);
  }

  do(callback, data) {
    if (this.callbacks[callback]) {
      for (const event of this.callbacks[callback]) {
        event(data);
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
  currentWaveform;
  audioLoadStart;
  audioLoadOffset;

  synthesizer: Synthesizer;
  effects: AudioEffects;
  compressor: AudioEffectNode;

  volume = 1;
  active = false;
  paused = true;
  started = false;


  constructor(public audioContext: AudioContext, public id = null, waveform = 'sine') {

    this.osc = this.audioContext.createOscillator();
    this.effects = new AudioEffects(this.audioContext, null, this.osc);
    this.compressor = this.effects.compressor;
    this.update();


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
    const pitchedFrequency = this.currentFrequency + (this.currentPitch * (880 / 12) * this.pitchAmount)
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
        const node = this.effects[key] as AudioEffectNode;
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
    return this.currentGain = this.gainValue(value)
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
      this.paused = false;
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
    if (!this.paused) {
      this.audioContext.suspend();
      this.paused = true;
    }
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
    const note = noteArr[0].replace("#", "2").toLowerCase();
    const octave = noteArr[1] || 1;
    return this.noteValues[note][octave];
  };
}

export class OSCSaveData {
  currentWaveform = 'sine';
  active = false;
}

export class LFO {
  // Low Frequency OSC
  type = 'lfo';

  synthesizer: Synthesizer;
  waveforms = [
    'sine',
    'square',
    'sawtooth',
    'triangle'
  ];
  currentWaveform = this.waveforms[0];


  constructor(public id = null) {
  }
}

export class LFOSaveData {

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
    nodeType: 'threshold',
    min: -100,
    max: 0,
    step: 1,
    value: (value = this.threshold.currentValue) => {
      this.compressor.do('valueChange', 'threshold', value);
      return this.threshold.currentValue = value;
    }
  } as AudioEffectNode;

  knee = {
    nodeType: 'knee',
    min: 0,
    max: 1,
    step: .01,
    value: (value = this.compressor.value('knee')) => {
      this.compressor.value('knee', value);
      this.compressor.do('valueChange', 'knee', value);
      return this.compressor.currentValue;
    }
  } as AudioEffectNode;

  ratio = {
    nodeType: 'ratio',
    min: 1,
    max: 20,
    step: 1,
    value: (value = this.compressor.value('ratio')) => {
      this.compressor.value('ratio', value);
      this.compressor.do('valueChange', 'ratio', value);
      return this.compressor.currentValue;
    }
  } as AudioEffectNode;

  attack = {
    nodeType: 'attack',
    min: 0,
    max: 1,
    step: .01,
    value: (value = this.compressor.value('attack')) => {
      this.compressor.value('attack', value);
      this.compressor.do('valueChange', 'attack', value);
      return this.compressor.currentValue;
    }
  } as AudioEffectNode;

  release = {
    nodeType: 'release',
    min: 0,
    max: 1,
    step: .01,
    value: (value = this.compressor.value('release')) => {
      this.compressor.value('release', value);
      this.compressor.do('valueChange', 'release', value);
      return this.compressor.currentValue;
    }
  } as AudioEffectNode;

  constructor(public audioContext, public media: HTMLMediaElement = null, osc: any = null) {
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

  }

  set(effectName, value) {
    if (this[effectName] && this[effectName].value) {
      return this[effectName].value(value)
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

  constructor(public audioContext: AudioContext, public nodeType: string, public osc: any = null) {
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
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 180;
        let x;
        for (let i = 0; i < n_samples; i++) {
          x = i * 2 / n_samples - 1;
          curve[i] = (3 + amount) * x * 20 * deg / (Math.PI + amount * Math.abs(x));
        }
        return curve;
      };
      this.audioNode = this.audioContext.createWaveShaper();
      this.min = 0;
      this.max = 1000;
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
      this.max = 16000;
      this.step = 1;
      this.default = 0;
      this.on('valueChange', (value = this.currentValue, options = null) => {
        this.audioNode.delayTime.setValueAtTime(value, this.audioContext.currentTime);
      });
    }

    if (nodeType === 'compressor') {
      this.audioNode = this.audioContext.createDynamicsCompressor();
      this.on('valueChange', (type, value) => {
        if (this.audioNode[type]) {
          this.audioNode[type].setValueAtTime(value, this.audioContext.currentTime);
        }
      });
    }
    this.value(this.default);
    this.connect();
    this.disconnect();
  }

  type(type = this.audioNode.type) {
    for (const available of this.types) {
      if (type === available) {
        this.audioNode.type = type;
      }
    }
    return this.audioNode.type;
  };

  start() {
    this.connect(true);
  }

  stop() {
    this.disconnect(true);
  }


  connect(force = false) {

    if (!this.connected && (this.active || force)) {
      if (this.source) {
        if (this.sourceConnected) {
          this.source.disconnect(this.audioNode);
          this.sourceConnected = false;
        }
        this.source.connect(this.audioContext.destination);
      }
      if (this.osc) {
        this.osc.connect(this.audioNode);
        this.oscConnected = true;
      }
      this.audioNode.connect(this.audioContext.destination);

      this.connected = true;
      this.active = true;
    } else if (!this.active) {
      this.disconnect();
    }

  }

  disconnect(force = false) {
    if (this.osc && this.oscConnected) {
      this.osc.disconnect(this.audioNode);
      this.oscConnected = false;
    }
    if (this.source && this.sourceConnected) {
      this.source.disconnect(!this.audioContext.destination);
      this.source.connect(this.audioNode);
      this.sourceConnected = true;
    }
    if (this.connected) {
      this.audioNode.disconnect(this.audioContext.destination);
    }
    if (force) {
      this.active = false;
    }
    this.connected = false;
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
  source: any;
  targets: AudioEffectNode[] = [];
  value = null;

  constructor() {
  }

  change(value = this.value) {
    this.value = value || 0;
  }

  clear() {
    if (confirm('clear connections')) {
      this.type = null;
      this.source = null;
      this.targets = [];
      this.value = null;
    }
  }

}

export class SynthesizerSaveData {
  volume = 1;
  release = 250;
  delay = 0;
  lfos: any[] = [];
  oscs: any[] = [];
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
          for (const lfoKey in saveData[key][i]) {
            this.synthesizer.oscs[i][lfoKey] = saveData[key][i][lfoKey];
          }
          this.synthesizer.oscs[i].update();
        }
      } else if (key === 'lfos') {
        let lfo: LFO;
        for (let i = 0; i < saveData[key].length; i++) {
          if (!this.synthesizer.lfos[i]) {
            lfo = this.synthesizer.addLfo(i + 1);
          } else {
            lfo = this.synthesizer.lfos[i];
          }
          for (const lfoKey in saveData[key]) {
            lfo[lfoKey] = saveData[key][lfoKey];
          }
        }
      } else {
        this.synthesizer[key] = saveData[key];
      }
    }
    this.synthesizer.do('onload', saveData);
  }

  saveSynthesizer() {
    if (!this.saving) {
      this.saving = true;

      const saveData = new SynthesizerSaveData();
      for (const key in saveData) {
        if (key !== 'lfos' && key !== 'oscs') {
          saveData[key] = this.synthesizer[key];
        }
      }
      for (let osc of this.synthesizer.oscs) {
        const saveDataOsc = new OSCSaveData();
        for (const key in saveDataOsc) {
          saveDataOsc[key] = osc[key];
        }
        saveData.oscs.push(saveDataOsc);
      }
      for (let lfo of this.synthesizer.lfos) {
        const saveDataLfo = new LFOSaveData();
        for (const key in saveDataLfo) {
          saveDataLfo[key] = lfo[key];
        }
        saveData.lfos.push(saveDataLfo);
      }
      this.saveLocalStorage(saveData);
      this.synthesizer.do('onsave', saveData);
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
        for (let osc of savedData.oscs) {
          const saveDataOsc = new OSCSaveData();
          for (const key in saveDataOsc) {
            saveDataOsc[key] = osc[key];
          }
          saveData.oscs.push(saveDataOsc);
        }
      }
      if (savedData.oscs) {
        for (let lfo of savedData.lfos) {
          const saveDataLfo = new LFOSaveData();
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
  controllers: MIDIController[] = [];

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
    midiAccess.onstatechange = (e) => {
      this.updateMidiInput(e.port);
    };
  }

  updateMidiInput(input) {
    let exist = false;
    for (let controller of this.controllers) {
      if (controller.id === input.id) {
        controller.name = name;
        controller.input = input;
        exist = true;
      }
    }
    if (!exist) {
      this.controllers.push(new MIDIController(input, this.synthesizer));
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
        this.synthesizer.stop();
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
