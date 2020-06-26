import { Component, ElementRef, AfterViewInit, ViewChild, OnChanges, SimpleChanges, Output, Input } from '@angular/core';
import { SynthesizerLayout } from '../synthesizer.service';

@Component({
  selector: 'app-synthesizer-canvas',
  templateUrl: './synthesizer-canvas.component.html',
  styleUrls: ['./synthesizer-canvas.component.scss']
})
export class SynthesizerCanvasComponent implements AfterViewInit, OnChanges {
  @ViewChild('canvas', {static: false}) canvasRef: ElementRef;
  @Input() type;

  layout: SynthesizerLayout = new SynthesizerLayout();

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  width = 0;
  height = 0;
  centerX = 0;
  centerY = 0;

  mouseIsDown = false;
  mouseIsOver = false;
  mouseStart = {x: 0, y: 0};
  mouseOffset = {x: 0, y: 0};

  constructor() {
  }

  ngAfterViewInit(): void {
    this.initCanvas();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.onChanges();
    this.updateCanvas();
  }

  mouseOver(event) {
    this.mouseIsOver = true;
    this.updateCanvas();
    this.onMouseOver(event);
  }

  mouseOut(event) {
    this.mouseIsOver = false;
    this.updateCanvas();
    this.onMouseOut(event);
  }

  mouseDown(event) {
    this.mouseIsDown = true;
    this.mouseStart = {
      x: event.layerX,
      y: event.layerY
    };
    this.updateCanvas();
    this.onMouseDown(event);
  }

  mouseUp(event) {
    this.mouseIsDown = false;
    this.updateCanvas();
    this.onMouseUp(event);
  }

  mouseMove(event) {
    this.mouseOffset = {
      x: event.layerX - this.mouseStart.x,
      y: event.layerY - this.mouseStart.y
    };
    this.updateCanvas();
    this.onMouseMove(event);
  }

  initCanvas() {
    if (this.canvasRef) {
      this.canvas = this.canvasRef.nativeElement;
      this.ctx = this.canvas.getContext('2d');
      this.updateCanvas();
    }
  }

  updateCanvas() {
    if (this.ctx) {
      this.canvasSize();
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

  drawCanvas(ctx = this.ctx) {
    this.onDrawCanvas(ctx);
  }

  @Output()
  onInit() {
    // stuff when after view init
  }

  @Output()
  onChanges() {
    // stuff when detect changes
  }

  @Output()
  onMouseOver(event) {
  }

  @Output()
  onMouseOut(event) {
  }

  @Output()
  onMouseDown(event) {
  }

  @Output()
  onMouseUp(event) {
  }

  @Output()
  onMouseMove(event) {
  }

  @Output()
  onDrawCanvas(ctx = this.ctx) {
  }


}
