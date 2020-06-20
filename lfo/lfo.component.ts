import { Component, Input, OnInit } from '@angular/core';
import { LFO } from '../synthesizer.service';

@Component({
  selector: 'app-lfo',
  templateUrl: './lfo.component.html',
  styleUrls: ['./lfo.component.scss']
})
export class LfoComponent implements OnInit {
  @Input() lfo: LFO;

  constructor() {
  }

  ngOnInit(): void {
  }

  connectLfo() {
    this.lfo.synthesizer.connectNode = this.lfo;
  }

}
