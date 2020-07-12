import { AudioEffect } from '../audio-effect';
import { AudioEffectNode } from '../audio-effect-node';

export class AudioBiquadFilter extends AudioEffect {
  name = 'Biquad Filter';
  effectName = 'biquadFilter';
  effectParam = 'valueAtTime';
  effectAttr = 'frequency';
  effectUnit = 'amount';
  min = 0;
  max = 22050;
  step = 1;
  value = 3000;
  effectNode;

  createEffect() {
    this.effectNode = this.audioContext.createBiquadFilter();
  }

  init() {
    this.effectNodes.push(new AudioEffectNode(
      this.effectName, this.effectParam, this.effectUnit,
      this.value,
      this.min, this.max, this.step,
      this.effectNode,
      this.audioContext,
      this.effectAttr,
      this.sampleRate
    ));
  }

  connect() {
    if (!this.connected) {
      this.source.connect(this.effectNode);
      this.effectNode.connect(this.audioContext.destination);
      this.connected = true;
    }
  }

  disconnect() {
    if (this.connected) {
      this.source.disconnect(this.effectNode);
      this.effectNode.disconnect(this.audioContext.destination);
      this.connected = false;
    }
  }


}
