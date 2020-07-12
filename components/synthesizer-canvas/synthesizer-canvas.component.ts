import { Component, ElementRef, AfterViewInit, ViewChild, OnChanges, SimpleChanges, Output, Input, OnDestroy } from '@angular/core';
import { SynthesizerLayout } from '../../synthesizer.layout';
import { Synthesizer } from '../../classes/synthesizer/synthesizer';

@Component({
  selector: 'app-synthesizer-canvas',
  templateUrl: './synthesizer-canvas.component.html',
  styleUrls: ['./synthesizer-canvas.component.scss']
})
export class SynthesizerCanvasComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('canvas', {static: false}) canvasRef: ElementRef;
  @Input() type;
  @Input() lineWidth = 2;
  @Input() synthesizer: Synthesizer;
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

  updateEvent;

  constructor() {
  }

  ngAfterViewInit(): void {
    this.initCanvas();

    setTimeout(() => {
      this.updateCanvas();
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges) {

    this.onChanges();
    this.updateCanvas();
  }

  ngOnDestroy() {
    this.destroyCanvas();
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
    if (this.synthesizer) {
      this.updateEvent = this.synthesizer.on('update', () => {
        this.updateCanvas();
      });
    }
  }

  updateCanvas() {
    if (this.ctx) {
      this.ctx.lineWidth = this.lineWidth;
      this.canvasSize();
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.drawCanvas();
    }
  }

  destroyCanvas() {
    if (this.synthesizer && this.updateEvent) {
      this.synthesizer.removeCallback('update', this.updateEvent);
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


  drawTimePosition(ctx = this.ctx) {

    if (this.synthesizer && this.synthesizer.currentBeat && this.synthesizer.currentBeat['%']) {
      ctx.fillStyle = this.layout.colors.default.main;
      ctx.fillRect(this.width * (this.synthesizer.currentBeat['%'] / 100), 0, this.lineWidth, this.height);
      this.onDrawTimePosition(this.synthesizer.currentBeat['%']);
    }

  }


  onDrawTimePosition(percent: number) {
    // stuff when time position changes
  }

  onInit() {
    // stuff when after view init
  }

  onChanges() {
    // stuff when detect changes
  }

  onMouseOver(event) {
  }

  onMouseOut(event) {
  }

  onMouseDown(event) {
  }

  onMouseUp(event) {
  }

  onMouseMove(event) {
  }

  onDrawCanvas(ctx = this.ctx) {
  }


}
