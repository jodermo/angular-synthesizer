import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SynthesizerLfo } from './classes/synthesizer-lfo';
import { SynthesizerOsc } from './classes/synthesizer-osc';
import { Synthesizer } from './classes/synthesizer';
import { SynthesizerService } from './synthesizer.service';
import { SynthesizerSequencer } from './classes/synthesizer-sequencer';


@Component({
  selector: 'app-synthesizer',
  templateUrl: './synthesizer.component.html',
  styleUrls: ['./synthesizer.component.scss']
})
export class SynthesizerComponent implements OnInit {

  views = ['osc', 'lfo'];
  currentView = this.views[0];
  synthesizer: Synthesizer;
  currentOsc: SynthesizerOsc;
  currentLfo: SynthesizerLfo;
  currentSequencer: SynthesizerSequencer;
  currentOscNumber;
  octaves = 4;
  connectLfo: SynthesizerLfo;
  showSettings = false;
  nodesTabs = ['LFO', 'Sequencer'];
  nodesTab = this.nodesTabs[0];


  constructor(public audioEditor: SynthesizerService, private cdRef: ChangeDetectorRef) {
    this.synthesizer = new Synthesizer(3, 1, 1, cdRef);
    if (this.synthesizer.oscs) {
      this.currentOsc = this.synthesizer.oscs[0];
    }
  }


  ngOnInit(): void {
  }

  showView(viewName) {
    this.currentView = viewName;
  }

  selectOsc(osc: SynthesizerOsc) {
    if (this.synthesizer.oscs) {
      for (let i = 0; i < this.synthesizer.oscs.length; i++) {
        if (this.synthesizer.oscs[i] === osc) {
          this.currentOscNumber = i + 1;
        }
      }
    }
    this.currentOsc = osc;
  }


  selectLfo(lfo: SynthesizerLfo) {
    this.currentLfo = lfo;
  }

  selectSequencer(sequencer: SynthesizerSequencer) {
    this.currentSequencer = sequencer;
  }


  pianoKeyDown(e) {
    this.synthesizer.playNote(e.note, e.octave);
  }

  pianoKeyUp(e) {
    this.synthesizer.stopTone();
  }

  setPitch(pitch) {
    this.synthesizer.pitch(pitch);
  }

}
