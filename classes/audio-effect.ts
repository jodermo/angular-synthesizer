import { SynthesizerNode } from './synthesizer-node';
import { SynthesizerOsc } from './synthesizer-osc';

export class AudioEffect {

  audioNode;
  source;
  types = [];
  min = 0;
  max = 1;
  step = .01;
  default = 0;
  currentValue = this.default;
  valueOnTop = 0;
  active = false;
  connected = false;
  oscConnected = false;
  sourceConnected = false;
  callbacks = {
    valueChange: []
  };
  nodes: SynthesizerNode[] = [];

  value: any = (value = this.currentValue, options = null) => {
    this.currentValue = value;
    this.do('valueChange', this.totalValue(), options);
    return this.currentValue;
  };

  connect: any = (force = false) => {
    if (this.audioNode && !this.connected && (this.active || force)) {
      if (this.source && this.source.connect) {
        if (this.sourceConnected) {
          this.source.disconnect(this.audioNode);
          this.sourceConnected = false;
        }
        this.source.connect(this.audioContext.destination);
      }
      if (this.osc) {
        this.osc.osc.connect(this.audioNode);
        this.oscConnected = true;
      }
      if (this.audioContext) {
        this.audioNode.connect(this.audioContext.destination);
      }
      this.connected = true;
      this.active = true;
    } else if (!this.active) {
      this.disconnect();
    }
  };

  disconnect: any = (force = false) => {
    if (this.osc && this.oscConnected) {
      this.osc.osc.disconnect(this.audioNode);
      this.oscConnected = false;
    }
    if (this.source && this.sourceConnected) {
      this.source.disconnect(!this.audioContext.destination);
      this.source.connect(this.audioNode);
      this.sourceConnected = true;
    }
    if (this.connected && this.audioContext) {
      this.audioNode.disconnect(this.audioContext.destination);
    }
    if (force) {
      this.active = false;
    }
    this.connected = false;
  };

  constructor(public audioContext: AudioContext, public nodeType: string, public osc: SynthesizerOsc = null, effectOptions: any = null) {
    if (nodeType === 'gain') {
      this.audioNode = this.audioContext.createGain();
      this.min = 0;
      this.max = 1;
      this.step = 0.01;
      this.default = 1;
      this.on('valueChange', (value = this.totalValue(), options = null) => {
        this.audioNode.gain.value = value;
      });
    }

    if (nodeType === 'pan') {
      this.audioNode = this.audioContext.createStereoPanner();
      this.types = ['sine'];
      this.min = -1;
      this.max = 1;
      this.step = 0.01;
      this.default = 0;
      this.on('valueChange', (value = this.totalValue(), options = null) => {
        this.audioNode.pan.setValueAtTime(value, this.audioContext.currentTime);
      });
    }

    if (nodeType === 'distortion') {
      const makeDistortionCurve = (amount = 50) => {
        const nSamples = 44100;
        const curve = new Float32Array(nSamples);
        const deg = Math.PI / 180;
        let x;
        for (let i = 0; i < nSamples; i++) {
          x = i * 2 / nSamples - 1;
          curve[i] = (3 + amount) * x * 20 * deg / (Math.PI + amount * Math.abs(x));
        }
        return curve;
      };
      this.audioNode = this.audioContext.createWaveShaper();
      this.min = 0;
      this.max = 10000;
      this.step = 1;
      this.default = 0;
      this.on('valueChange', (value = this.totalValue(), options = null) => {
        this.audioNode.curve = makeDistortionCurve(value);
        this.audioNode.oversample = '4x';
      });
    }

    if (nodeType === 'biquadFilter') {
      this.audioNode = this.audioContext.createBiquadFilter();
      this.types = ['lowshelf'];
      this.min = 0;
      this.max = 22050;
      this.step = 1;
      this.default = 3000;
      this.on('valueChange', (value = this.totalValue(), options = null) => {
        this.audioNode.frequency.setValueAtTime(value, this.audioContext.currentTime);
      });
    }

    if (nodeType === 'convolver') {
      this.audioNode = this.audioContext.createConvolver();
    }

    if (nodeType === 'delay') {
      this.audioNode = this.audioContext.createDelay();
      this.min = 0;
      this.max = 1;
      this.step = .01;
      this.default = 0;
      this.on('valueChange', (value = this.totalValue(), options = null) => {
        this.audioNode.delayTime.setValueAtTime(value, this.audioContext.currentTime);
      });
    }

    if (nodeType === 'compressor') {
      this.audioNode = this.audioContext.createDynamicsCompressor();
      this.min = 1;
      this.max = 20;
      this.step = .1;
      this.default = 1;
      this.on('valueChange', (type, value = this.totalValue()) => {
        if (this.audioNode[type]) {
          this.audioNode[type].setValueAtTime(value, this.audioContext.currentTime);
        }
      });
    }
    if (effectOptions) {
      // tslint:disable-next-line:forin
      for (const key in effectOptions) {
        this[key] = effectOptions[key];
        // console.log(nodeType, key, effectOptions[key]);
      }
    }
    this.on('valueChange', (value) => {
      if (this.osc) {
        this.osc.valueChange();
      }
    });
    this.value(this.default);
    this.connect();
    this.disconnect();
  }

  addValue(value: number) {
    this.valueOnTop = value * (this.max - this.min) / 100;
    return this.currentValue;
  }

  totalValue() {
    const value = this.currentValue + this.valueOnTop;
    if (value > this.max) {
      return this.max;
    } else if (value < this.min) {
      return this.min;
    }
    return value;
  }

  type(type = this.audioNode.type) {
    for (const available of this.types) {
      if (type === available) {
        this.audioNode.type = type;
      }
    }
    return this.audioNode.type;
  }

  start() {
    this.connect(true);
  }

  stop() {
    this.disconnect(true);
  }


  on(callback, event) {
    if (this.callbacks[callback]) {
      this.callbacks[callback].push(event);
    }
  }

  do(callback, data: any = null, options: any = null) {
    if (this.callbacks[callback]) {
      for (const event of this.callbacks[callback]) {
        event(data, options);
      }
    }
  }

}
