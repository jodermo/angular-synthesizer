import { AfterViewInit, Component, Input } from '@angular/core';
import { SynthesizerOsc } from '../classes/synthesizer-osc';

@Component({
  selector: 'app-osc',
  templateUrl: './osc.component.html',
  styleUrls: ['./osc.component.scss']
})
export class OscComponent implements AfterViewInit {
  @Input() osc: SynthesizerOsc;

  ready = false;
  currentTab;

  constructor() {
  }

  ngAfterViewInit(): void {
    this.ready = true;
  }


}
