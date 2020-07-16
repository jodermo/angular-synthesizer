import { SynthesizerModulator } from '../synthesizer/synthesizer-modulator/synthesizer-modulator';

export class AudioEffectNode {
  source: SynthesizerModulator;
  effectNodes: AudioEffectNode[] = [];
  modulators: SynthesizerModulator[] = [];
  totalValue = 0;
  modulatorsValue = 0;
  modulatorsValues = [];

  constructor(
    public name,
    public param,
    public unit,
    public currentValue = 0,
    public min = 0, public max = 100, public step = 1,
    public effectNode,
    public audioContext,
    public nodeAttr = 'value',
    public sampleRate = 88200
  ) {

  }

  addNode() {
    const node = new AudioEffectNode(
      this.name,
      this.param,
      this.unit,
      this.currentValue,
      this.min, this.max, this.step,
      this.effectNode,
      this.audioContext,
      this.nodeAttr,
      this.sampleRate
    );
    this.effectNodes.push(node);
    return node;
  }

  removeNode(node: AudioEffectNode) {
    node.clear();
    for (let i = 0; i < this.effectNodes.length; i++) {
      if (this.effectNodes[i] === node) {
        this.effectNodes.splice(i, 1);
      }
    }
  }

  addModulator(modulator: SynthesizerModulator) {
    this.modulators.push(modulator);

  }

  removeModulator(modulator: SynthesizerModulator) {
    for (let i = 0; i < this.modulators.length; i++) {
      if (this.modulators[i] === modulator) {
        this.modulators.splice(i, 1);
      }
    }
  }

  setSource(source: SynthesizerModulator) {
    this.source = source;
  }

  value(value = this.currentValue) {
    if (value !== this.currentValue) {
      this.currentValue = value;
      this.update();
    }
    return this.currentValue;
  }

  update() {

    this.modulatorsValue = 0;
    this.modulatorsValues = [];
    for (const modulator of this.modulators) {
      if (modulator.active) {
        this.modulatorsValue += modulator.currentValue;
        this.modulatorsValues.push(modulator.currentValue);
      }
    }
    const duration = (this.max - this.min) / 100;
    let total = this.currentValue + (this.modulatorsValue * duration);
    if (total > this.max) {
      total = this.max;
    } else if (total < this.min) {
      total = this.min;
    }
    this.totalValue = total;
    if (this.effectNode !== null) {
      if (this.param === 'valueAtTime') {
        this.effectNode[this.nodeAttr].setValueAtTime(this.totalValue, this.audioContext.currentTime);
      } else if (this.param === 'distortionCurve') {
        this.effectNode[this.nodeAttr] = this.makeDistortionCurve(this.totalValue);
        this.effectNode.oversample = '4x';
      } else {
        // this.effectNode[this.param][this.nodeAttr] = this.totalValue;
      }
    }
  }

  clear() {
    this.source = null;
  }

  makeDistortionCurve(amount = 50, samples = this.sampleRate) {
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;
    let x;
    for (let i = 0; i < samples; i++) {
      x = i * 2 / samples - 1;
      curve[i] = (3 + amount) * x * 20 * deg / (Math.PI + amount * Math.abs(x));
    }
    return curve;
  }
}
