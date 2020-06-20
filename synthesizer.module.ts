import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SynthesizerSettingsComponent } from './synthesizer-settings/synthesizer-settings.component';
import { OscControlsComponent } from './osc-controls/osc-controls.component';
import { SynthesizerControlComponent } from './synthesizer-control/synthesizer-control.component';
import { SynthesizerComponent } from './synthesizer.component';
import { OscComponent } from './osc/osc.component';
import { PianoKeysComponent } from './piano-keys/piano-keys.component';
import { MidiControllerComponent } from './midi-controller/midi-controller.component';
import { LfoComponent } from './lfo/lfo.component';
import { SynthesizerService } from './synthesizer.service';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SynthesizerComponent,
    PianoKeysComponent,
    OscControlsComponent,
    OscComponent,
    SynthesizerControlComponent,
    LfoComponent,
    MidiControllerComponent,
    SynthesizerSettingsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatSliderModule
  ],
  providers: [
    SynthesizerService
  ],
  exports:[
    SynthesizerComponent,
    PianoKeysComponent,
    OscControlsComponent,
    OscComponent,
    SynthesizerControlComponent,
    LfoComponent,
    MidiControllerComponent,
    SynthesizerSettingsComponent
  ]
})
export class SynthesizerModule {
}
