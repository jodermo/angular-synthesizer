import { Component, Input, OnInit } from '@angular/core';
import { SynthesizerSequencer } from '../../classes/synthesizer/synthesizer-modulator/synthesizer-modulators/synthesizer-sequencer';

@Component({
  selector: 'app-sequencer',
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss']
})
export class SequencerComponent implements OnInit {
  @Input() sequencer: SynthesizerSequencer;

  showOptions = false;


  constructor() {
  }

  ngOnInit(): void {
  }

  connect() {
    this.sequencer.synthesizer.connectNode = this.sequencer;
  }


}
