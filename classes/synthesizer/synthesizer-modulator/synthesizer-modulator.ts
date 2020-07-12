import { AudioEffect } from '../../audio-effect/audio-effect';
import { Synthesizer } from '../synthesizer';


export class SynthesizerModulator {
  type = 'effect';
  active = true;
  synthesizer: Synthesizer;
  targetNodes: AudioEffect[] = [];

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

      for (const node of this.targetNodes) {
        console.log('updateTargetNodes', value, node);
        if ((node as any).addPercentValue) {

          (node as any).addPercentValue(value);
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
