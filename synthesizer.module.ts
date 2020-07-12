import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SynthesizerCanvasComponent } from './components/synthesizer-canvas/synthesizer-canvas.component';
import { FrequencyFilterCanvasComponent } from './components/synthesizer-canvas/frequency-filter-canvas/frequency-filter-canvas.component';
import { SynthesizerComponent } from './synthesizer.component';
import { SequencerComponent } from './modulators/sequencer/sequencer.component';
import { OscComponent } from './components/osc/osc.component';
import { EqualizerComponent } from './effects/equalizer/equalizer.component';
import { PianoKeysComponent } from './components/piano-keys/piano-keys.component';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { SynthesizerControlComponent } from './components/synthesizer-control/synthesizer-control.component';
import { SequencerCanvasComponent } from './components/synthesizer-canvas/sequencer-canvas/sequencer-canvas.component';
import { WaveformCanvasComponent } from './components/synthesizer-canvas/waveform-canvas/waveform-canvas.component';
import { SynthesizerService } from './synthesizer.service';
import { MidiControlsComponent } from './components/midi-controls/midi-controls.component';
import { SynthesizerDisplayComponent } from './components/synthesizer-display/synthesizer-display.component';
import { LfoComponent } from './modulators/lfo/lfo.component';
import { PanComponent } from './effects/pan/pan.component';
import { GainComponent } from './effects/gain/gain.component';
import { DistortionComponent } from './effects/distortion/distortion.component';
import { CompressorComponent } from './effects/compressor/compressor.component';
import { OscEffectComponent } from './effects/osc-effect/osc-effect.component';



@NgModule({
  declarations: [
    SynthesizerComponent,
    PianoKeysComponent,
    OscComponent,
    SynthesizerControlComponent,
    LfoComponent,
    MidiControlsComponent,
    SynthesizerCanvasComponent,
    FrequencyFilterCanvasComponent,
    WaveformCanvasComponent,
    SequencerComponent,
    SequencerCanvasComponent,
    SynthesizerDisplayComponent,
    EqualizerComponent,
    PanComponent,
    GainComponent,
    DistortionComponent,
    CompressorComponent,
    OscEffectComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatSliderModule
  ],
  providers: [
    SynthesizerService
  ],
  exports: [
    SynthesizerComponent,
    PianoKeysComponent,
    OscComponent,
    SynthesizerControlComponent,
    LfoComponent,
    MidiControlsComponent
  ]
})
export class SynthesizerModule {
}
