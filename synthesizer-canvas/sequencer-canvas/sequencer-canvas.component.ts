import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SynthesizerCanvasComponent } from '../synthesizer-canvas.component';
import { SequencerValue } from '../../synthesizer.service';


@Component({
  selector: 'app-sequencer-canvas',
  templateUrl: '../synthesizer-canvas.component.html',
  styleUrls: ['../synthesizer-canvas.component.scss']
})
export class SequencerCanvasComponent extends SynthesizerCanvasComponent {
  @Input() frequency = 1;
  @Input() values = [0, 0, 0, 0];
  @Input() reverse = false;

  sequence = {
    width: 0,
    height: 0
  };

  mouseOverSequence;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onValue = new EventEmitter<SequencerValue>();

  onInit() {

  }

  drawCanvas(ctx = this.ctx) {
    for (let i = 0; i < this.values.length; i++) {
      this.drawSequence(ctx, i, this.values[i]);
    }
  }

  drawSequence(ctx = this.ctx, int, value) {
    this.sequence.width = this.width / this.values.length;
    this.sequence.height = this.height;
    const x = int * this.sequence.width;
    const valueY = this.height / (100 / value);
    const firstElm = (int % 4) === 0;
    const fourthElm = (int % 4) === 3;
    const mouseHover = (this.mouseOverSequence === int);
    const mouseDown = (mouseHover && this.mouseIsDown);
    console.log(int, firstElm, fourthElm);
    // draw value
    if (firstElm) {
      ctx.fillStyle = this.layout.colors.default.light;

    } else {
      ctx.fillStyle = this.layout.colors.default.dark;
    }
    ctx.fillRect(x, 0, this.sequence.width, this.sequence.height);
    ctx.fillStyle = this.layout.colors.default.main;
    if (mouseHover) {
      ctx.fillStyle = this.layout.colors.default.main;
    }
    if (mouseDown) {
      ctx.fillStyle = this.layout.colors.default.secondary;
    }
    ctx.fillRect(x, this.sequence.height - valueY, this.sequence.width, valueY);

    // draw lines

    if (firstElm) {
      ctx.strokeStyle = this.layout.colors.default.dark;
    } else {
      if (mouseHover) {
        ctx.strokeStyle = this.layout.colors.default.main;
      }
      if (mouseDown) {
        ctx.strokeStyle = this.layout.colors.default.secondary;
      }
    }
    ctx.beginPath();
    ctx.rect(x, 0, this.sequence.width, this.sequence.height);
    ctx.stroke();
  }

  onMouseDown(event) {
    super.onMouseDown(event);
    this.mouseIsOverValue(event);
    this.setMouseValue(event);
  }

  onMouseMove(event) {
    super.onMouseMove(event);
    this.mouseIsOverValue(event);
    if (this.mouseIsDown) {
      this.setMouseValue(event);
    }
  }

  setMouseValue(event) {
    const value = 100 - (event.layerY / this.height * 100);
    this.onValue.emit({int: this.mouseOverSequence, value});
  }

  onMouseOut(event) {
    super.onMouseOut(event);
    this.mouseOverSequence = null;
  }

  mouseIsOverValue(event) {
    this.mouseOverSequence = Math.floor(event.layerX / this.sequence.width);
  }
}
