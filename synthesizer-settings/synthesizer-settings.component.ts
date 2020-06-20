import { Component, Input, OnInit } from '@angular/core';
import { Synthesizer } from '../synthesizer.service';

@Component({
  selector: 'app-synthesizer-settings',
  templateUrl: './synthesizer-settings.component.html',
  styleUrls: ['./synthesizer-settings.component.scss']
})
export class SynthesizerSettingsComponent implements OnInit {
  @Input() synthesizer: Synthesizer;
  constructor() { }

  ngOnInit(): void {
  }

}
