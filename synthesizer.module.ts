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
import { SynthesizerCanvasComponent } from './synthesizer-canvas/synthesizer-canvas.component';
import { FrequencyFilterCanvasComponent } from './synthesizer-canvas/frequency-filter-canvas/frequency-filter-canvas.component';
import { WaveformCanvasComponent } from './synthesizer-canvas/waveform-canvas/waveform-canvas.component';
import { SequencerComponent } from './sequencer/sequencer.component';
import { SequencerCanvasComponent } from './synthesizer-canvas/sequencer-canvas/sequencer-canvas.component';


@NgModule({
  declarations: [
    SynthesizerComponent,
    PianoKeysComponent,
    OscControlsComponent,
    OscComponent,
    SynthesizerControlComponent,
    LfoComponent,
    MidiControllerComponent,
    SynthesizerSettingsComponent,
    SynthesizerCanvasComponent,
    FrequencyFilterCanvasComponent,
    WaveformCanvasComponent,
    SequencerComponent,
    SequencerCanvasComponent
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
