import { Component, Input } from '@angular/core';
import { AudioPan } from '../../classes/audio-effect/audio-effects/audio-pan';
import { OscEffectComponent } from '../osc-effect/osc-effect.component';

@Component({
  selector: 'app-pan',
  templateUrl: './pan.component.html',
  styleUrls: ['./pan.component.css']
})
export class PanComponent extends OscEffectComponent {
  @Input() pan: AudioPan;

}
