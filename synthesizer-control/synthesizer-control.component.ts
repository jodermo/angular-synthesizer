import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  AfterViewInit,
  Output,
  ViewChild,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { AudioEffectNode, Synthesizer, SynthesizerNode } from '../synthesizer.service';

@Component({
  selector: 'app-synthesizer-control',
  templateUrl: './synthesizer-control.component.html',
  styleUrls: ['./synthesizer-control.component.scss']
})
export class SynthesizerControlComponent implements AfterViewInit, OnChanges {
  @ViewChild('canvas', {static: false}) canvasRef: ElementRef;
  @Input() synthesizer: Synthesizer;
  @Input() sourceNode: AudioEffectNode;
  @Input() title;
  @Input() type = 'knob';
  @Input() min = 0;
  @Input() max = 1;
  @Input() step = 0.01;
  @Input() value = 0;
  @Input() default = 0;
  @Input() nodeCount = 3;
  @Input() speed = 1;
  @Input() knobRange = 280;
  @Input() knobRotation = 130;
  @Output() onChange = new EventEmitter<number>();
  @Output() onConnectNode = new EventEmitter<SynthesizerNode>();

  canvas: HTMLCanvasElement;
  ctx;
  width;
  height;
  centerX;
  centerY;
  middleValue;
  nodes: SynthesizerNode[] = [];
  knobColor = '#000';
  knobLegendColor = '#666';
  knobValueColor = '#0f0';
  knobTextColor = '#fff';
  knobLegendSize = 5;
  font = 'bold 1rem Arial';
  mouseIsDown = false;
  mouseStart;
  showSlider = false;
  fixedValue = 0;

  constructor() {
  }

  ngAfterViewInit(): void {
    this.initMiddleValue();
    this.initCanvas();
    this.initNodes();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.drawCanvas();
    this.initNodes();
  }

  connectNode(node: SynthesizerNode, source: any, type: string = null) {
    node.source = source;
    node.type = type;
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

  initCanvas() {
    if (this.canvasRef) {
      this.canvas = this.canvasRef.nativeElement;
      this.ctx = this.canvas.getContext('2d');
      this.drawCanvas();
    }
  }

  canvasSize() {
    if (this.canvas) {
      this.width = this.canvas.clientWidth;
      this.height = this.canvas.clientHeight;
      this.centerX = this.width / 2;
      this.centerY = this.height / 2;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }
  }

  drawCanvas() {
    this.initMiddleValue();
    if (this.ctx) {
      this.canvasSize();
      this.drawLegend();
      this.drawKnob();
      this.drawValue();
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
    this.ctx.fillText(this.value, this.centerX, this.centerY);
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
    this.nodes = this.sourceNode.nodes;
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

    this.drawCanvas();
    this.onChange.emit(this.value)
  }

  mouseDown(event) {
    this.mouseIsDown = true;
    this.mouseStart = {
      x: event.layerX,
      y: event.layerY
    }
  }

  mouseUp(event) {
    this.mouseIsDown = false;
  }

  mouseMove(event) {
    if (this.mouseIsDown && event) {
      const offset = {
        x: event.layerX - this.mouseStart.x,
        y: event.layerY - this.mouseStart.y
      };
      if (offset.y) {
        const duration = this.max - this.min;
        const newValue = this.value - ((offset.y * duration) * this.speed / 360);
        this.change(newValue);
      }
    }
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
