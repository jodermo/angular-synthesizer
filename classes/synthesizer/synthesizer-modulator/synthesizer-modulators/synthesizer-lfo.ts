import { SynthesizerModulator } from '../synthesizer-modulator';


export class SynthesizerLfo extends SynthesizerModulator {
  // Low Frequency OSC
  type = 'lfo';
  waveforms = [
    'sine',
    'square',
    'sawtooth',
    'triangle'
  ];
  currentWaveform = this.waveforms[0];

  onUpdate() {
    this.waveform();
  }

  waveform(waveform = this.currentWaveform) {
    return this.currentWaveform = waveform;
  }

  percentToValue(percent: number) {
    let value = Math.sin(percent / 100 * this.currentRate * Math.PI * 2) * this.currentAmplitude;
    if (this.currentWaveform === 'square') {
      if (value < 0) {
        value = -this.currentAmplitude;
      } else {
        value = this.currentAmplitude;
      }
    } else if (this.currentWaveform === 'sawtooth') {
      value = this.currentAmplitude - (percent * this.currentRate % 100) * 2 * this.currentAmplitude / this.currentMaxValue;
    } else if (this.currentWaveform === 'triangle') {
      value = ((this.currentRate) * percent) % 100 * this.currentAmplitude / this.currentMaxValue * 4;
      if (value > this.currentAmplitude) {
        // tslint:disable-next-line:max-line-length
        value = this.currentAmplitude - (((this.currentRate) * percent) % 100 * this.currentAmplitude / this.currentMaxValue * 4) + this.currentAmplitude;
      }
      if (value < -this.currentAmplitude) {
        value = -value - this.currentAmplitude * 2;
      }
    }
    return value;
  }

  remove() {
    if (this.synthesizer && confirm('are you sure?')) {
      for (let i = 0; i < this.synthesizer.lfos.length; i++) {
        if (this.synthesizer.lfos[i] === this) {
          return this.synthesizer.lfos.splice(i, 1);
        }

      }
    }
  }
}

export class SynthesizerLfoSaveData {
  currentWaveform = 'sine';
  active = false;
  amplitude = 100;
}
