import { Component, Input, OnInit } from '@angular/core';
import { Synthesizer } from '../../classes/synthesizer/synthesizer';

@Component({
  selector: 'app-midi-controls',
  templateUrl: './midi-controls.component.html',
  styleUrls: ['./midi-controls.component.scss']
})
export class MidiControlsComponent implements OnInit {
  @Input() synthesizer: Synthesizer;

  constructor() {
  }

  ngOnInit(): void {

  }




}
