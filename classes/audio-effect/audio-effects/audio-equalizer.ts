import { AudioEffect } from '../audio-effect';
import { AudioEffectNode } from '../audio-effect-node';

export class AudioEqualizer extends AudioEffect {
  name = 'Equalizer';
  highShelfNode;
  lowShelfNode;
  highPassNode;
  lowPassNode;


  init() {
    this.highShelfNode = this.audioContext.createBiquadFilter();
    this.lowShelfNode = this.audioContext.createBiquadFilter();
    this.highPassNode = this.audioContext.createBiquadFilter();
    this.lowPassNode = this.audioContext.createBiquadFilter();
    this.effectNodes.push(new AudioEffectNode(
      'highShelf', 'frequency', 'kHz',
      this.highShelfNode.frequency.value,
      4700, 22000, 100,
      this.highShelfNode,
      this.audioContext,
      'value',
      this.sampleRate
    ));
    this.effectNodes.push(new AudioEffectNode(
      'highShelf', 'gain', 'dB',
      this.highShelfNode.gain.value,
      -50, 50, 1,
      this.highShelfNode,
      this.audioContext,
      'value',
      this.sampleRate
    ));
    this.effectNodes.push(new AudioEffectNode(
      'lowShelf', 'frequency', 'kHz',
      this.lowShelfNode.frequency.value,
      35, 220, 1,
      this.lowShelfNode,
      this.audioContext,
      'value',
      this.sampleRate
    ));
    this.effectNodes.push(new AudioEffectNode(
      'lowShelf', 'gain', 'dB',
      this.lowShelfNode.gain.value,
      -50, 50, 1,
      this.lowShelfNode,
      this.audioContext,
      'value',
      this.sampleRate
    ));
    this.effectNodes.push(new AudioEffectNode(
      'highPass', 'frequency', 'kHz',
      this.highPassNode.frequency.value,
      4700, 22000, 100,
      this.highPassNode,
      this.audioContext,
      'value',
      this.sampleRate
    ));
    this.effectNodes.push(new AudioEffectNode(
      'highPass', 'Q', 'Q',
      this.highPassNode.Q.value,
      .7, 12, .1,
      this.highPassNode,
      this.audioContext,
      'value',
      this.sampleRate
    ));
    this.effectNodes.push(new AudioEffectNode(
      'lowPass', 'frequency', 'kHz',
      this.lowPassNode.frequency.value,
      35, 220, 1,
      this.lowPassNode,
      this.audioContext,
      'value',
      this.sampleRate
    ));
    this.effectNodes.push(new AudioEffectNode(
      'lowPass', 'Q', 'Q',
      this.lowPassNode.Q.value,
      .7, 12, .1,
      this.lowPassNode,
      this.audioContext,
      'value',
      this.sampleRate
    ));
  }

  connect() {
    if (!this.connected) {
      this.source.connect(this.highShelfNode);
      this.lowPassNode.connect(this.audioContext.destination);
      this.connected = true;
    }
  }

  disconnect() {
    if (this.connected) {
      this.source.disconnect(this.highShelfNode);
      this.lowPassNode.disconnect(this.audioContext.destination);
      this.connected = false;
    }
  }
}
