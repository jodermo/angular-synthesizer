import { Component, Input } from '@angular/core';
import { AudioCompressor } from '../../classes/audio-effect/audio-effects/audio-compressor';
import { OscEffectComponent } from '../osc-effect/osc-effect.component';

@Component({
  selector: 'app-compressor',
  templateUrl: './compressor.component.html',
  styleUrls: ['./compressor.component.scss']
})
export class CompressorComponent extends OscEffectComponent{
  @Input() compressor: AudioCompressor;

}
