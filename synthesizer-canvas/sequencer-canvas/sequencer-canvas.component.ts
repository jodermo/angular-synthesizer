import { Component, Input } from '@angular/core';
import { SynthesizerCanvasComponent } from '../synthesizer-canvas.component';

@Component({
  selector: 'app-sequencer-canvas',
  templateUrl: '../synthesizer-canvas.component.html',
  styleUrls: ['../synthesizer-canvas.component.scss']
})
export class SequencerCanvasComponent extends SynthesizerCanvasComponent {
  @Input() frequency = 1;
  @Input() amplitude = 100;
  @Input() reverse = false;

  onInit() {

  }

  drawCanvas(ctx: CanvasRenderingContext2D = this.ctx) {
    let steps = this.width;
    if (this.type === 'triangle') {
      steps = 4 * this.frequency;
    }
    let amplitude = (this.amplitude / 100 * this.height / 2);
    if (amplitude) {
      amplitude--;
    }
    ctx.strokeStyle = this.layout.colors.default.main;
    ctx.moveTo(0, this.height / 2);
    ctx.lineTo(this.width, this.height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, this.height / 2);

    const c = this.width / Math.PI / (this.frequency * 2);
    for (let i = 0; i <= this.width; i += (this.width / steps)) {
      if (this.type === 'square') {

      }
      let x = -amplitude * Math.sin(i / c);

      if (this.reverse) {
        x = amplitude * Math.sin(i / c);
      }
      const y = this.height / 2 + x;
      ctx.lineTo(i, y);

    }
    ctx.strokeStyle = this.layout.colors.default.light;
    ctx.stroke();
  }
}
