import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SynthesizerCanvasComponent } from '../synthesizer-canvas.component';
import { SynthesizerSequencer } from '../../../classes/synthesizer/synthesizer-modulator/synthesizer-modulators/synthesizer-sequencer';

class SequencerValue {
  int: number;
  value: any;
}

@Component({
  selector: 'app-sequencer-canvas',
  templateUrl: '../synthesizer-canvas.component.html',
  styleUrls: ['../synthesizer-canvas.component.scss']
})
export class SequencerCanvasComponent extends SynthesizerCanvasComponent {
  @Input() frequency = 1;
  @Input() values = [0, 0, 0, 0];
  @Input() reverse = false;

  @Input() sequencer: SynthesizerSequencer;

  currentSequence = 0;

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
    ctx.lineWidth = this.lineWidth;
    this.drawTimePosition();
    // draw value
    if (firstElm) {
      ctx.fillStyle = this.layout.colors.default.light;

    } else {
      ctx.fillStyle = this.layout.colors.default.dark;
    }
    // ctx.fillRect(x, 0, this.sequence.width, this.sequence.height);
    ctx.fillStyle = this.layout.colors.default.main;
    if (mouseHover) {
      ctx.fillStyle = this.layout.colors.default.main;
    }
    if (mouseDown) {
      ctx.fillStyle = this.layout.colors.default.secondary;
    }

    if (this.currentSequence === int + 1) {
      ctx.fillStyle = this.layout.colors.default.main;
    }
    ctx.fillRect(x, this.sequence.height - valueY, this.sequence.width, valueY);

    // draw lines

    if (firstElm) {
      ctx.strokeStyle = this.layout.colors.default.secondary;
    } else {
      ctx.strokeStyle = this.layout.colors.default.light;
      if (mouseHover) {
        ctx.strokeStyle = this.layout.colors.default.main;
      }
      if (mouseDown) {
        ctx.strokeStyle = this.layout.colors.default.secondary;
      }

    }
    if (this.currentSequence === int + 1) {
      ctx.strokeStyle = this.layout.colors.default.main;
    }
    ctx.beginPath();
    ctx.rect(x, 0, this.sequence.width, this.sequence.height);
    ctx.stroke();
  }

  onDrawTimePosition(percent: number) {
    this.currentSequence = Math.floor(percent / 100 * this.values.length) + 1;
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
