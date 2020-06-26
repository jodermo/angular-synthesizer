import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { AudioEffectNode, Synthesizer, SynthesizerNode } from '../synthesizer.service';
import { SynthesizerCanvasComponent } from '../synthesizer-canvas/synthesizer-canvas.component';

@Component({
  selector: 'app-synthesizer-control',
  templateUrl: './synthesizer-control.component.html',
  styleUrls: ['./synthesizer-control.component.scss']
})
export class SynthesizerControlComponent extends SynthesizerCanvasComponent {
  @Input() synthesizer: Synthesizer;
  @Input() sourceNode: AudioEffectNode;
  @Input() title;
  @Input() type = 'knob';
  @Input() min = 0;
  @Input() max = 1;
  @Input() step = 0.01;
  @Input() value = 0;

  @Input() outputMin;
  @Input() outputMiddle;
  @Input() outputMax;
  @Input() outputValue;


  @Input() default = 0;
  @Input() nodeCount = 3;
  @Input() speed = 1;
  @Input() knobRange = 280;
  @Input() knobRotation = 130;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChange = new EventEmitter<number>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onConnectNode = new EventEmitter<SynthesizerNode>();

  middleValue;
  nodes: SynthesizerNode[] = [];
  knobColor = '#00725f';
  knobLegendColor = '#353535';
  knobValueColor = '#00ffd9';
  knobTextColor = '#fff';
  knobLegendSize = 5;
  font = 'bold 1rem Arial';

  showSlider = false;
  fixedValue = 0;

  ready = false;

  onInit() {
    this.initMiddleValue();
    this.initNodes();

  }

  onChanges() {
    this.initNodes();
  }

  onMouseOver(event) {
    this.showSlider = true;
  }

  onMouseMove(event) {
    if (this.mouseIsDown && event) {
      if (this.mouseOffset.y) {
        const duration = this.max - this.min;
        const newValue = this.value - ((this.mouseOffset.y * duration) * this.speed / 360);
        this.change(newValue);
      }
    }
  }

  onDrawCanvas(ctx = this.ctx) {
    this.initMiddleValue();
    if (ctx) {
      this.canvasSize();
      this.drawLegend();
      this.drawKnob();
      this.drawValue();
    }
  }

  connectNode(node: SynthesizerNode, source: any, type: string = null) {
    node.source = source;
    node.type = type;
    if (this.synthesizer) {
      this.synthesizer.connectNode = null;
    }
    this.onConnectNode.emit(node);
  }

  clearNode(node: SynthesizerNode) {
    node.clear();
  }

  initMiddleValue() {
    if (this.max < 0) {
      this.middleValue = (this.max + this.min) / 2;
      if (this.min < 0) {
        this.middleValue = (this.max - this.min) / 2;
      }
    } else {
      this.middleValue = (this.max - this.min) / 2;
      if (this.min < 0) {
        this.middleValue = (this.max + this.min) / 2;
      }
    }
  }


  drawLegend() {
    const size = this.width / 2 - this.knobLegendSize;
    const start = (this.knobRotation - 1) * (Math.PI / 180);
    const end = (2 + this.knobRotation + this.getKnobRotation()) * (Math.PI / 180);
    this.ctx.strokeStyle = this.knobLegendColor;
    this.ctx.lineWidth = this.knobLegendSize;
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, size, start, end);
    this.ctx.stroke();
  }


  drawKnob() {
    const size = this.width / 2 - this.knobLegendSize;
    this.ctx.fillStyle = this.knobColor;
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, size, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.stroke();
  }


  drawValue() {
    const size = this.width / 2 - this.knobLegendSize;
    const start = (this.knobRotation - 1) * (Math.PI / 180);
    const end = (2 + this.knobRotation + this.getKnobRotation()) * (Math.PI / 180);
    this.ctx.strokeStyle = this.knobValueColor;
    this.ctx.lineWidth = this.knobLegendSize;
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, size, start, end);
    this.ctx.stroke();
    this.ctx.font = this.font;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = this.knobTextColor;
    let value = this.value;
    if (this.outputValue || this.outputValue === 0) {
      value = this.outputValue;
    }
    this.ctx.fillText(String(value), this.centerX, this.centerY);
  }

  initNodes() {
    this.nodes = [];
    if (this.sourceNode && !this.sourceNode.nodes) {
      this.sourceNode.nodes = [];
    }
    if (this.sourceNode && this.sourceNode.nodes.length < this.nodeCount) {
      const count = this.nodeCount - this.sourceNode.nodes.length;
      for (let i = 0; i < count; i++) {
        const node = new SynthesizerNode();
        this.sourceNode.nodes.push(node);
      }
    }
    if (this.sourceNode) {
      this.nodes = this.sourceNode.nodes;
    }
    this.change();
  }

  change(value = this.value) {
    if (value > this.max) {
      this.value = this.max;
    } else if (value < this.min) {
      this.value = this.min;
    } else {
      this.value = value;
    }
    const stepStr = '' + this.step;
    const splitString = stepStr.split('.');
    if (splitString[1] && splitString[1].length) {
      this.fixedValue = splitString[1].length;
    }
    if (this.fixedValue) {
      this.value = Number(this.value.toFixed(this.fixedValue));
    } else {
      this.value = Math.floor(this.value);
    }
    this.ready = true;
    this.drawCanvas();
    this.onChange.emit(this.value);
  }


  getKnobRotation() {
    let duration = this.max - this.min;
    if (this.max < 0) {
      duration = Math.abs(this.max) + Math.abs(this.min);
      if (this.min < 0) {
        duration = Math.abs(this.max) - Math.abs(this.min);
      }
    } else if (this.min < 0) {
      duration = this.max + Math.abs(this.min);
    }
    if (Math.abs(this.max) === Math.abs(this.min)) {
      return (this.knobRange / 2) + ((this.knobRange) / 2) * this.value;
    }
    return ((this.knobRange) / duration) * this.value;
  }

}
