import { Component, Input, OnInit } from '@angular/core';
import { SynthesizerLfo } from '../../classes/synthesizer/synthesizer-modulator/synthesizer-modulators/synthesizer-lfo';

@Component({
  selector: 'app-lfo',
  templateUrl: './lfo.component.html',
  styleUrls: ['./lfo.component.scss']
})
export class LfoComponent implements OnInit {
  @Input() lfo: SynthesizerLfo;
  @Input() amplitude = 100;
  @Input() rate = 1;

  showOptions = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  connect() {
    this.lfo.synthesizer.connectNode = this.lfo;
  }


}
