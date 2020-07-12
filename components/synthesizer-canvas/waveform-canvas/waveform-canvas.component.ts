import { Component, Input } from '@angular/core';
import { SynthesizerCanvasComponent } from '../synthesizer-canvas.component';
import { SynthesizerLfo } from '../../../classes/synthesizer/synthesizer-modulator/synthesizer-modulators/synthesizer-lfo';

@Component({
  selector: 'app-waveform-canvas',
  templateUrl: '../synthesizer-canvas.component.html',
  styleUrls: ['../synthesizer-canvas.component.scss']
})
export class WaveformCanvasComponent extends SynthesizerCanvasComponent {

  @Input() lfo: SynthesizerLfo;
  @Input() frequency = 1;
  @Input() amplitude = 100;
  @Input() reverse = false;

  onInit() {

  }

  drawCanvas(ctx: CanvasRenderingContext2D = this.ctx) {
    let steps = this.width;
    if (this.type === 'triangle') {
      steps = 4 * this.frequency;
    } else if (this.type === 'square') {
      steps = this.frequency;
    } else if (this.type === 'sawtooth') {
      steps = this.frequency;
    }
    const value = (this.amplitude / 100 * this.height / 2);
    let amplitude = value;
    if (amplitude) {
      amplitude -= this.lineWidth;
    }
    ctx.lineWidth = this.lineWidth;


    ctx.strokeStyle = this.layout.colors.default.dark;
    ctx.moveTo(0, this.height / 2);
    ctx.lineTo(this.width, this.height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, this.height / 2);

    const c = this.width / Math.PI / (this.frequency * 2);
    const stepWidth = (this.width / steps);
    for (let i = 0; i <= this.width; i += stepWidth) {

      let x = -amplitude * Math.sin(i / c);

      if (this.reverse) {
        x = amplitude * Math.sin(i / c);
      }
      let y = this.height / 2 + x;

      if (this.type === 'square') {
        y = this.height / 2 - value;
        if (this.reverse) {
          y = this.height / 2 + value;
        }
        ctx.lineTo(i, y);
        ctx.lineTo(i + stepWidth / 2, y);
        y = this.height / 2 + value;
        if (this.reverse) {
          y = this.height / 2 - value;
        }
        ctx.lineTo(i + stepWidth / 2, y);
        ctx.lineTo(i + stepWidth, y);
        ctx.lineTo(i + stepWidth, this.height / 2);
        ctx.stroke();
      } else if (this.type === 'sawtooth') {
        y = this.height / 2 - value;
        if (this.reverse) {
          y = this.height / 2 + value;
        }
        ctx.lineTo(i, y);
        y = this.height / 2 + value;
        if (this.reverse) {
          y = this.height / 2 - value;
        }
        ctx.lineTo(i + stepWidth, y);
      } else {
        ctx.lineTo(i, y);
      }
    }
    ctx.strokeStyle = this.layout.colors.active.secondary;
    ctx.stroke();
    this.drawTimePosition();
  }

  onDrawTimePosition(percent: number) {
    const size = 10;
    const ctx = this.ctx;
    const value = this.lfo.percentToValue(percent);
    const x = this.width * percent / 100;
    const y = this.height / 2 - (this.height / 2 * value / 100);
    ctx.strokeStyle = this.layout.colors.default.secondary;
    ctx.beginPath();
    ctx.lineTo(0, y);
    ctx.lineTo(this.width, y);
    ctx.stroke();
    ctx.fillStyle = this.layout.colors.default.light;
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();
  }

}
