import { Synthesizer } from './synthesizer';
import { AudioEffect } from './audio-effect';

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
