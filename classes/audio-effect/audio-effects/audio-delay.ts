import { AudioEffect } from '../audio-effect';
import { AudioEffectNode } from '../audio-effect-node';

export class AudioDelay extends AudioEffect {
  name = 'Delay';
  delayNode;

  init() {
    this.delayNode = this.audioContext.createDelay();
    this.effectNodes.push(new AudioEffectNode(
      'delay', 'valueAtTime', 'dly',
      this.delayNode.delayTime.value,
      0, 1, .01,
      this.delayNode,
      this.audioContext,
      'delayTime',
      this.sampleRate
    ));
  }

  connect() {
    if (!this.connected) {
      this.source.connect(this.delayNode);
      this.delayNode.connect(this.audioContext.destination);
      this.connected = true;
    }
  }

  disconnect() {
    if (this.connected) {
      this.source.disconnect(this.delayNode);
      this.delayNode.disconnect(this.audioContext.destination);
      this.connected = false;
    }
  }
}
