import { AfterViewInit, Component, Input } from '@angular/core';
import { SynthesizerOsc } from '../../classes/synthesizer/synthesizer-osc/synthesizer-osc';
import { Synthesizer } from '../../classes/synthesizer/synthesizer';

@Component({
  selector: 'app-osc',
  templateUrl: './osc.component.html',
  styleUrls: ['./osc.component.scss']
})
export class OscComponent implements AfterViewInit {
  @Input() synthesizer: Synthesizer;
  @Input() osc: SynthesizerOsc;
  ready = false;
  currentTab;

  constructor() {
  }

  ngAfterViewInit(): void {
    this.ready = true;
  }


}
