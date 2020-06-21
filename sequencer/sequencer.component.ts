import { Component, Input, OnInit } from '@angular/core';
import { LFO, Sequencer } from '../synthesizer.service';

@Component({
  selector: 'app-sequencer',
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss']
})
export class SequencerComponent implements OnInit {
  @Input() sequencer: Sequencer;
  @Input() amplitude = 100;
  @Input() rate = 1;

  showOptions = false;


  constructor() {
  }

  ngOnInit(): void {
  }

  connect() {
    this.sequencer.synthesizer.connectNode = this.sequencer;
  }

}
