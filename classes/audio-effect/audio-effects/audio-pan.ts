import { AudioEffect } from '../audio-effect';
import { AudioEffectNode } from '../audio-effect-node';

export class AudioPan extends AudioEffect {
  name = 'Pan';
  panNode;
  pan;

  init() {
    this.panNode = this.audioContext.createStereoPanner();
    this.pan = new AudioEffectNode(
      'pan', 'valueAtTime', 'L/R',
      this.panNode.pan.value,
      -1, 1, .01,
      this.panNode,
      this.audioContext,
      'pan',
      this.sampleRate
    );
    this.effectNodes.push(this.pan);
  }

  connect() {
    if (!this.connected) {
      this.source.connect(this.panNode);
      this.panNode.connect(this.audioContext.destination);
      this.connected = true;
    }
  }

  disconnect() {
    if (this.connected) {
      this.source.disconnect(this.panNode);
      this.panNode.disconnect(this.audioContext.destination);
      this.connected = false;
    }
  }
}
