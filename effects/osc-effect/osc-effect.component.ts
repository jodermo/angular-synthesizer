import { Component, Input } from '@angular/core';
import { Synthesizer } from '../../classes/synthesizer/synthesizer';
import { SynthesizerOsc } from '../../classes/synthesizer/synthesizer-osc/synthesizer-osc';

@Component({
  selector: 'app-osc-effect',
  templateUrl: './osc-effect.component.html',
  styleUrls: ['./osc-effect.component.css']
})
export class OscEffectComponent {
  @Input() synthesizer: Synthesizer;
  @Input() osc: SynthesizerOsc;

  constructor() {
  }

}
