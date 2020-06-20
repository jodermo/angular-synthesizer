import { Component, Input, OnInit } from '@angular/core';
import { Synthesizer } from '../synthesizer.service';


@Component({
  selector: 'app-midi-controller',
  templateUrl: './midi-controller.component.html',
  styleUrls: ['./midi-controller.component.scss']
})
export class MidiControllerComponent implements OnInit {
  @Input() synthesizer: Synthesizer;

  constructor() {
  }

  ngOnInit(): void {

  }




}
