import { AudioEqualizer } from '../../audio-effect/audio-effects/audio-equalizer';
import { AudioEffect } from '../../audio-effect/audio-effect';
import { Synthesizer } from '../synthesizer';
import { AudioCompressor } from '../../audio-effect/audio-effects/audio-compressor';
import { AudioPan } from '../../audio-effect/audio-effects/audio-pan';
import { AudioGain } from '../../audio-effect/audio-effects/audio-gain';
import { AudioBiquadFilter } from '../../audio-effect/audio-effects/audio-biquad-filter';
import { AudioDistortion } from '../../audio-effect/audio-effects/audio-distortion';
import { AudioDelay } from '../../audio-effect/audio-effects/audio-delay';


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

  audioLoadStart;
  audioLoadOffset;


  controlViews = ['compressor', 'equalizer'];
  controlView = this.controlViews[0];

  synthesizer: Synthesizer;


  audioGain: AudioGain;
  audioPan: AudioPan;
  audioDelay: AudioDelay;
  audioCompressor: AudioCompressor;
  audioEqualizer: AudioEqualizer;
  audioDistortion: AudioDistortion;
  audioBiquadFilter: AudioBiquadFilter;

  audioEffects: AudioEffect[] = [];

  volume = 1;
  active = false;
  started = false;
  ready = false;

  constructor(public audioContext: AudioContext, public id = null, public currentWaveform = 'sine', public sampleRate = 88200) {
    if (!currentWaveform) {
      this.currentWaveform = this.waveforms[0];
    }
    this.osc = this.audioContext.createOscillator();

    this.audioGain = new AudioGain(this.osc, this.audioContext, this.sampleRate);
    this.audioEffects.push(this.audioGain);
    this.audioPan = new AudioPan(this.osc, this.audioContext, this.sampleRate);
    this.audioEffects.push(this.audioPan);
    this.audioDelay = new AudioDelay(this.osc, this.audioContext, this.sampleRate);
    this.audioEffects.push(this.audioDelay);
    this.audioCompressor = new AudioCompressor(this.osc, this.audioContext, this.sampleRate);
    this.audioEffects.push(this.audioCompressor);
    this.audioEqualizer = new AudioEqualizer(this.osc, this.audioContext, this.sampleRate);
    this.audioEffects.push(this.audioEqualizer);
    this.audioDistortion = new AudioDistortion(this.osc, this.audioContext, this.sampleRate);
    this.audioEffects.push(this.audioDistortion);
    this.audioBiquadFilter = new AudioBiquadFilter(this.osc, this.audioContext, this.sampleRate);
    this.audioEffects.push(this.audioBiquadFilter);

    this.update();

  }

  update() {
    this.pitch();
    this.waveform();
    this.time();
    this.timeOffset();
    this.updateAudioEffects();
    this.ready = true;
  }

  updateAudioEffects() {
    for (const effect of this.audioEffects) {
      effect.update();
    }
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
    for (const effect of this.audioEffects) {
        effect.start();
    }
  }


  stop(deactivate = false) {
    for (const effect of this.audioEffects) {
      effect.stop();
    }
    if (deactivate) {
      this.active = false;
    }
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
