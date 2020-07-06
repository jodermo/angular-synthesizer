import { Component, Input, OnInit } from '@angular/core';
import { OscComponent } from '../osc/osc.component';
import { Synthesizer } from '../classes/synthesizer';
import { AudioEffect } from '../classes/audio-effect';

@Component({
  selector: 'app-osc-effect-control',
  templateUrl: './osc-effect-control.component.html',
  styleUrls: ['./osc-effect-control.component.css']
})
export class OscEffectControlComponent extends OscComponent {
  @Input() effect: AudioEffect;
  @Input() synthesizer: Synthesizer;

  // tslint:disable-next-line:use-lifecycle-interface


  ngAfterViewInit(): void {
    if (this.effect && !this.osc) {
      this.osc = this.effect.osc;
    }
  }
}
