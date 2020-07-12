import { Component, Input } from '@angular/core';
import { AudioEqualizer } from '../../classes/audio-effect/audio-effects/audio-equalizer';
import { OscEffectComponent } from '../osc-effect/osc-effect.component';

@Component({
  selector: 'app-equalizer',
  templateUrl: './equalizer.component.html',
  styleUrls: ['./equalizer.component.scss']
})
export class EqualizerComponent extends OscEffectComponent {
  @Input() equalizer: AudioEqualizer;

}
