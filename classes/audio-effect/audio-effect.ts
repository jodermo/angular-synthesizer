import { SynthesizerModulator } from '../synthesizer/synthesizer-modulator/synthesizer-modulator';
import { AudioEffectNode } from './audio-effect-node';

export class AudioEffect {
  name = 'Audio Effect';
  effectName: string;
  effectParam: string;
  effectAttr: string;
  effectUnit: string;
  min = 0;
  max = 1;
  step = .1;
  value = 0;
  effectNode;

  active = false;
  connected = false;
  effectNodes: AudioEffectNode[] = [];


  constructor(
    public source: MediaElementAudioSourceNode,
    public audioContext: AudioContext = null,
    public sampleRate = 88200
  ) {
    if (!audioContext) {
      this.audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)({sampleRate});
    }
    this.createEffect();
    this.init();
  }


  getNode(name, param) {
    for (const effectNode of this.effectNodes) {
      if (effectNode.name === name && effectNode.param === param) {
        return effectNode;
      }
    }
    return null;
  }

  setValue(value, name = this.effectName, param = this.effectParam) {
    const node = this.getNode(name, param);
    if (node) {
      node.value(value);
    }
  }


  start() {
    if (!this.active) {
      this.connect();
      this.active = true;
    }

  }

  stop() {
    if (this.active) {
      this.disconnect();
      this.active = false;
    }
  }

  update() {
    if (this.effectNodes.length) {
      for (const effectNode of this.effectNodes) {
        effectNode.update();
      }
    }
  }

  createEffect() {
    // create effect here
  }

  init() {
    // init effect nodes here
  }

  connect() {
    if (!this.connected) {
      // connect effect nodes here
      this.connected = true;
    }
  }

  disconnect() {
    if (this.connected) {
      // disconnect effect nodes here
      this.connected = false;
    }
  }

}


