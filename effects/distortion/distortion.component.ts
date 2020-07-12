import { Component, Input } from '@angular/core';
import { AudioDistortion } from '../../classes/audio-effect/audio-effects/audio-distortion';
import { OscEffectComponent } from '../osc-effect/osc-effect.component';

@Component({
  selector: 'app-distortion',
  templateUrl: './distortion.component.html',
  styleUrls: ['./distortion.component.scss']
})
export class DistortionComponent extends OscEffectComponent{
  @Input() distortion: AudioDistortion;

}
