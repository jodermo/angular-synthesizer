import { SynthesizerModulator } from './synthesizer-modulator';

export class SynthesizerNode {
  type: string;
  source: SynthesizerModulator;
  value = null;

  constructor() {
  }

  change(value = this.value) {
    this.value = value || 0;
  }

  update() {
    if (this.source && this.source.synthesizer && this.source.synthesizer.currentBeat) {
      this.value = this.source.percentToValue(this.source.synthesizer.currentBeat['%']);
    }
  }

  clear() {
    if (confirm('clear connections')) {
      this.type = null;
      this.source = null;
      this.value = null;
    }
  }

}
