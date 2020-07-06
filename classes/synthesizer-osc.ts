import { Synthesizer } from './synthesizer';
import { AudioEffects } from './audio-effects';
import { AudioEffect } from './audio-effect';


export class SynthesizerOsc {
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
  compressor: AudioEffect;

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
    const nodes: AudioEffect[] = [];
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

export class SynthesizerOscSaveData {
  currentWaveform = 'sine';
  active = false;
}
