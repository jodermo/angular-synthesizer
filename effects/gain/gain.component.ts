import { Component, Input } from '@angular/core';
import { AudioGain } from '../../classes/audio-effect/audio-effects/audio-gain';
import { OscEffectComponent } from '../osc-effect/osc-effect.component';

@Component({
  selector: 'app-gain',
  templateUrl: './gain.component.html',
  styleUrls: ['./gain.component.scss']
})
export class GainComponent extends OscEffectComponent {
  @Input() audioGain: AudioGain;
}
