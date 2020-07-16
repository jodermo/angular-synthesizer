import { AudioEffect } from '../audio-effect';
import { AudioEffectNode } from '../audio-effect-node';

export class AudioGain extends AudioEffect {
  name = 'Gain';
  gainNode;
  gain;

  init() {
    this.gainNode = this.audioContext.createGain();
    this.gain = new AudioEffectNode(
      'gain', 'valueAtTime', 'vol',
      this.gainNode.gain.value,
      0, 1, .01,
      this.gainNode,
      this.audioContext,
      'gain',
      this.sampleRate
    );
    this.effectNodes.push(this.gain);
  }

  connect() {
    if (!this.connected) {
      this.source.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
      this.connected = true;
    }
  }

  disconnect() {
    if (this.connected) {
      this.source.disconnect(this.gainNode);
      this.gainNode.disconnect(this.audioContext.destination);
      this.connected = false;
    }
  }
}
