import { SynthesizerModulator } from '../synthesizer-modulator';

export class SynthesizerSequencer extends SynthesizerModulator {
  // Step Sequencer
  type = 'seq';
  steps = 4;
  stepsMin = 4;
  stepsMax = 64;
  ready = false;
  values = [];
  allValues = [];

  currentTime = 0;
  currentBeat;

  constructor(public id = null) {
    super(id);
    this.update();
    this.ready = true;
  }

  onUpdate() {
    if (this.synthesizer) {
      this.currentTime = this.synthesizer.currentTime;
      this.currentBeat = this.synthesizer.currentBeat;
    }
    this.updateValues();
    this.updateTargetNodes();
  }

  updateValues() {
    if (this.steps > this.values.length) {
      const length = this.steps - this.values.length;
      for (let i = 0; i < length; i++) {
        const value = this.sequenceValue(this.values.length - 1 + i);
        this.values.push(value);
      }
    } else if (this.steps < this.values.length) {
      const length = this.values.length - this.steps;
      this.values.splice(this.steps - 1, length);
    }
  }

  sequenceValue(int, value: number = this.allValues[int] || 0) {
    this.allValues[int] = value || 0;
    this.values[int] = this.allValues[int];
    return this.values[int];
  }

  percentToValue(percent: number) {
    const int = Math.round(this.values.length / 100 * percent);
    return this.values[int];
  }

  remove() {
    if (this.synthesizer && confirm('are you sure?')) {
      for (let i = 0; i < this.synthesizer.sequencers.length; i++) {
        if (this.synthesizer.sequencers[i] === this) {
          return this.synthesizer.sequencers.splice(i, 1);
        }

      }
    }
  }
}

export class SynthesizerSequencerSaveData {
  currentWaveform = 'sine';
  active = false;
  amplitude = 100;
}
