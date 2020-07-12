import { AudioEffect } from '../audio-effect';
import { AudioEffectNode } from '../audio-effect-node';

export class AudioCompressor extends AudioEffect {
  name = 'Compressor';

  createEffect() {
    this.effectNode = this.audioContext.createDynamicsCompressor();
  }

  init() {

    this.effectNodes.push(new AudioEffectNode(
      'compressor', 'attack', 'kHz',
      this.effectNode.attack.value,
      0, 1, .01,
      this.effectNode,
      this.audioContext,
      'value',
      this.sampleRate
    ));
    this.effectNodes.push(new AudioEffectNode(
      'compressor', 'knee', 'kHz',
      this.effectNode.knee.value,
      0, 1, .01,
      this.effectNode,
      this.audioContext,
      'value',
      this.sampleRate
    ));
    this.effectNodes.push(new AudioEffectNode(
      'compressor', 'ratio', 'kHz',
      this.effectNode.ratio.value,
      1, 20, 1,
      this.effectNode,
      this.audioContext,
      'value',
      this.sampleRate
    ));
    this.effectNodes.push(new AudioEffectNode(
      'compressor', 'release', 'kHz',
      this.effectNode.release.value,
      0, 1, .01,
      this.effectNode,
      this.audioContext,
      'value',
      this.sampleRate
    ));
    this.effectNodes.push(new AudioEffectNode(
      'compressor', 'threshold', 'kHz',
      this.effectNode.threshold.value,
      -100, 0, 1,
      this.effectNode,
      this.audioContext,
      'value',
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
