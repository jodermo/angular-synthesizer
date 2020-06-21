import { Component } from '@angular/core';
import { SynthesizerCanvasComponent } from '../synthesizer-canvas.component';

@Component({
  selector: 'app-frequency-filter-canvas',
  templateUrl: '../synthesizer-canvas.component.html',
  styleUrls: ['../synthesizer-canvas.component.scss']
})
export class FrequencyFilterCanvasComponent extends SynthesizerCanvasComponent {

  onInit() {
    // stuff when after view init
  }

  onChanges() {
    // stuff when detect changes
  }

  drawCanvas() {
    // draw canvas stuff to "this.ctx"
  }

}
