import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LFO, OSC, Synthesizer, SynthesizerService } from './synthesizer.service';
import { AppService } from '../../core/services/app.service';


@Component({
  selector: 'app-synthesizer',
  templateUrl: './synthesizer.component.html',
  styleUrls: ['./synthesizer.component.scss']
})
export class SynthesizerComponent implements OnInit {

  views = ['osc', 'lfo'];
  currentView = this.views[0];
  synthesizer: Synthesizer;
  currentOsc: OSC;
  currentLfo: LFO;
  currentOscNumber;
  octaves = 4;
  connectLfo: LFO;

  constructor(public app: AppService, public audioEditor: SynthesizerService, private ref: ChangeDetectorRef) {
    this.synthesizer = new Synthesizer(3);
    if (this.synthesizer.oscs) {
      this.currentOsc = this.synthesizer.oscs[0];
    }
  }


  ngOnInit(): void {
  }

  showView(viewName) {
    this.currentView = viewName;
  }

  selectOsc(osc: OSC) {
    if (this.synthesizer.oscs) {
      for (let i = 0; i < this.synthesizer.oscs.length; i++) {
        if (this.synthesizer.oscs[i] === osc) {
          this.currentOscNumber = i + 1;
        }
      }
    }
    this.currentOsc = osc;
  }



  selectLfo(lfo: LFO) {
    this.currentLfo = lfo;
  }

  pianoKeyDown(e) {
    this.synthesizer.playNote(e.note, e.octave);
  }

  pianoKeyUp(e) {
    this.synthesizer.stop();
  }

  setPitch(pitch) {
    this.synthesizer.pitch(pitch);
  }

}
