import { Component, Input, OnInit } from '@angular/core';
import { Synthesizer } from '../synthesizer.service';

@Component({
  selector: 'app-synthesizer-display',
  templateUrl: './synthesizer-display.component.html',
  styleUrls: ['./synthesizer-display.component.scss']
})
export class SynthesizerDisplayComponent implements OnInit {
  @Input() synthesizer: Synthesizer;

  constructor() {
  }

  ngOnInit(): void {
  }

}