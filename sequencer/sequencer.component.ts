import { Component, Input, OnInit } from '@angular/core';
import { LFO, Sequencer, SequencerValue } from '../synthesizer.service';

@Component({
  selector: 'app-sequencer',
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss']
})
export class SequencerComponent implements OnInit {
  @Input() sequencer: Sequencer;

  showOptions = false;


  constructor() {
  }

  ngOnInit(): void {
  }

  connect() {
    this.sequencer.synthesizer.connectNode = this.sequencer;
  }


}
