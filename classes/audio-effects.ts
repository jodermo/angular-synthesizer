
import { SynthesizerOsc } from './synthesizer-osc';
import { AudioEffect } from './audio-effect';

// @ts-ignore
export class AudioEffects {

  gain: AudioEffect;
  pan: AudioEffect;
  distortion: AudioEffect;
  biquadFilter: AudioEffect;
  convolver: AudioEffect;
  delay: AudioEffect;

  compressor: AudioEffect;
  source;

  threshold = {
    min: -100,
    max: 0,
    step: 1,
    value: (value = this.threshold.currentValue) => {
      this.compressor.do('valueChange', 'threshold');
      return this.threshold.currentValue = value;
    }
  } as AudioEffect;

  knee = {
    min: 0,
    max: 1,
    step: .01,
    value: (value = this.compressor.value('knee')) => {
      this.compressor.value('knee', value);
      this.compressor.do('valueChange', 'knee');
      return this.compressor.currentValue;
    }
  } as AudioEffect;

  ratio = {
    min: 1,
    max: 20,
    step: 1,
    value: (value = this.compressor.value('ratio')) => {
      if(value > this.ratio.min && value < this.ratio.max){
        this.ratio.currentValue = value;
        this.compressor.value('ratio', value);
        this.compressor.do('valueChange', 'ratio');
        return this.ratio.currentValue;
      }
    }
  } as AudioEffect;

  attack = {
    min: 0,
    max: 1,
    step: .01,
    value: (value = this.compressor.value('attack')) => {
      this.compressor.value('attack', value);
      this.compressor.do('valueChange', 'attack');
      return this.compressor.currentValue;
    },
    connect: () => {
      return this.compressor.connect();
    },
    disconnect: (value = this.compressor.value('attack')) => {
      return this.compressor.disconnect();
    }
  } as AudioEffect;

  release = {
    min: 0,
    max: 1,
    step: .01,
    value: (value = this.compressor.value('release')) => {
      this.compressor.value('release', value);
      this.compressor.do('valueChange', 'release');
      return this.compressor.currentValue;
    }
  } as AudioEffect;

  constructor(public audioContext, public media: HTMLMediaElement = null, osc: SynthesizerOsc) {
    if (this.media) {
      this.source = this.audioContext.createMediaElementSource(this.media);
    }
    this.gain = new AudioEffect(this.audioContext, 'gain', osc);
    this.pan = new AudioEffect(this.audioContext, 'pan', osc);
    this.distortion = new AudioEffect(this.audioContext, 'distortion', osc);
    this.biquadFilter = new AudioEffect(this.audioContext, 'biquadFilter', osc);
    this.convolver = new AudioEffect(this.audioContext, 'convolver', osc);
    this.delay = new AudioEffect(this.audioContext, 'delay', osc);
    this.compressor = new AudioEffect(this.audioContext, 'compressor', osc);

    this.threshold = new AudioEffect(this.audioContext, 'threshold', osc, this.threshold);
    this.knee = new AudioEffect(this.audioContext, 'knee', osc, this.knee);
    this.ratio = new AudioEffect(this.audioContext, 'ratio', osc, this.ratio);
    this.attack = new AudioEffect(this.audioContext, 'attack', osc, this.attack);
    this.release = new AudioEffect(this.audioContext, 'release', osc, this.release);
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
