import { AudioEffect } from '../audio-effect';
import { AudioEffectNode } from '../audio-effect-node';

export class AudioDistortion extends AudioEffect {
  name = 'Distortion';
  distortionNode;
  distortion = 1;

  init() {
    this.distortionNode = this.audioContext.createStereoPanner();

    this.effectNodes.push(new AudioEffectNode(
      'distortion', 'distortionCurve', 'dist',
      this.distortion,
      0, 10000, 1,
      this.distortionNode,
      this.audioContext,
      'curve',
      this.sampleRate
    ));

  }

  connect() {
    if (!this.connected) {
      this.source.connect(this.distortionNode);
      this.distortionNode.connect(this.audioContext.destination);
      this.connected = true;
    }
  }

  disconnect() {
    if (this.connected) {
      this.source.disconnect(this.distortionNode);
      this.distortionNode.disconnect(this.audioContext.destination);
      this.connected = false;
    }
  }


}
