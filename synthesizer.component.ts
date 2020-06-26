import { Component, OnInit } from '@angular/core';
import { LFO, OSC, Sequencer, Synthesizer, SynthesizerService } from './synthesizer.service';


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
  currentSequencer: Sequencer;
  currentOscNumber;
  octaves = 4;
  connectLfo: LFO;
  showSettings = false;
  nodesTabs = ['LFO', 'Sequencer'];
  nodesTab = this.nodesTabs[0];


  constructor(public audioEditor: SynthesizerService) {
    this.synthesizer = new Synthesizer(3, 1, 1);
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

  selectSequencer(sequencer: Sequencer) {
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
