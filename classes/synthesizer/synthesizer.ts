import { MIDIManager } from '../midi/midi-manager';
import { SynthesizerLfo } from './synthesizer-modulator/synthesizer-modulators/synthesizer-lfo';
import { SynthesizerManager } from './synthesizer-manager/synthesizer-manager';
import { SynthesizerSequencer } from './synthesizer-modulator/synthesizer-modulators/synthesizer-sequencer';
import { ChangeDetectorRef } from '@angular/core';
import { SynthesizerOsc } from './synthesizer-osc/synthesizer-osc';
import { SynthesizerModulator } from './synthesizer-modulator/synthesizer-modulator';

export class Synthesizer {

  restartOnTrigger = false;
  paused = true;
  isTone = false;
  metronome = false;
  volume = 1;
  release = 250;
  delay = 0;
  currentPitch = 0;
  currentTempo = 120;
  startTime = 0;
  currentTime = 0;
  currentNote = 'C';
  currentOctave = 1;
  totalBeat;
  currentBeat;
  beatString;


  manager = new SynthesizerManager(this);
  midi = new MIDIManager(this);
  callbacks: any = {};
  audioContext: AudioContext;
  oscs: SynthesizerOsc[] = [];
  lfos: SynthesizerLfo[] = [];
  sequencers: SynthesizerSequencer[] = [];
  connectNode: SynthesizerModulator;

  constructor(
    public oscCount: number = 3,
    public lfoCount: number = 1,
    public sequencerCount: number = 1,
    private changeDetector: ChangeDetectorRef
  ) {
    this.restart();
    // tslint:disable-next-line:new-parens
    this.audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)({sampleRate: 88200});
    for (let i = 0; i < this.oscCount; i++) {
      this.addOsc(i + 1);
    }
    for (let i = 0; i < this.lfoCount; i++) {
      this.addLfo(i + 1);
    }
    for (let i = 0; i < this.sequencerCount; i++) {
      this.addSequencer(i + 1);
    }
    if (this.oscs.length) {
      this.oscs[0].active = true;
    }


  }

  valueChange() {
    if (this.changeDetector) {
      // this.changeDetector.detectChanges();
    }
  }

  update() {
    for (const osc of this.oscs) {
      osc.update();
    }
    for (const lfo of this.lfos) {
      lfo.update();
    }
    for (const sequencer of this.sequencers) {
      sequencer.update();
    }
    this.do('update', this.currentTime);
  }

  addOsc(id = 0) {
    if (id === 0) {
      id = this.oscs.length + 1;
    }
    const osc = new SynthesizerOsc(this.audioContext, id);
    osc.synthesizer = this;
    this.oscs.push(osc);
    return osc;
  }

  addLfo(id = 0) {
    if (id === 0) {
      id = this.lfos.length + 1;
    }
    const lfo = new SynthesizerLfo(id);
    lfo.synthesizer = this;
    this.lfos.push(lfo);
    return lfo;
  }

  addSequencer(id = 0) {
    if (id === 0) {
      id = this.sequencers.length + 1;
    }
    const sequencer = new SynthesizerSequencer(id);
    sequencer.synthesizer = this;
    sequencer.currentTime = this.currentTime;
    sequencer.currentBeat = this.currentBeat;
    this.sequencers.push(sequencer);
    return sequencer;
  }

  setRestart(restart = this.restartOnTrigger) {
    this.restartOnTrigger = restart;
    if (restart) {
      this.metronome = false;
    }
    this.restart();
  }

  play() {
    this.paused = false;
    this.timeUpdate();
    this.do('play', this.currentTime);
  }

  pause() {
    this.paused = true;
    this.timeUpdate();
    this.do('pause', this.currentTime);
  }

  startTone() {
    this.stopTone();
    for (const osc of this.oscs) {
      osc.start();
    }
    this.isTone = true;
    this.timeUpdate();
    this.do('start', [this.currentNote, this.currentOctave]);
  }

  stopTone() {
    if (this.isTone) {
      this.isTone = false;
      for (const osc of this.oscs) {
        osc.stop();
      }
      this.do('stop', [this.currentNote, this.currentOctave]);
    }
  }

  playNote(note = this.currentNote, octave = this.currentOctave) {
    this.currentNote = note.toLowerCase();
    this.currentOctave = octave;
    if (this.restartOnTrigger && !this.isTone) {
      this.restart();
    }
    this.isTone = true;
    for (const osc of this.oscs) {
      osc.playNote([this.currentNote, octave]);
    }
    this.startTone();
    this.do('playnote', [note, octave]);
  }

  triggerNote(note = 'C', octave = 1, delay = this.delay, release = this.release) {
    setTimeout(() => {
      this.playNote(note, octave);
      setTimeout(() => {
        this.stopTone();
      }, release);
    }, delay);
    this.do('triggernote', [note, octave, delay, release]);
  }


  restart() {
    this.startTime = Date.now();
    this.totalBeat = {
      1: 0,
      2: 0,
      4: 0,
      8: 0,
      16: 0,
      32: 0,
      64: 0
    };
    this.currentBeat = {
      '%': 0,
      1: 1,
      2: 1,
      4: 1,
      8: 1,
      16: 1,
      32: 1,
      64: 1
    };
    this.timeUpdate();
  }

  time() {
    this.timeUpdate();
    this.do('timechange', this.currentTime);
    return this.currentTime;
  }

  tempo(tempo = this.currentTempo) {
    this.currentTempo = tempo;
    this.do('tempochange', this.currentTempo);
    return this.currentTempo;
  }

  pitch(pitch = this.currentPitch) {
    this.currentPitch = pitch;
    for (const osc of this.oscs) {
      osc.pitch(this.currentPitch);
    }
    this.do('pitchchange', this.currentPitch);
    return this.currentPitch;
  }

  save() {
    this.manager.saveSynthesizer();
  }

  reset() {
    if (confirm('you want to reset modulation?')) {
      localStorage.removeItem('synthesizer-data');
      location.reload();
    }

  }

  timeUpdate() {
    if (!this.startTime) {
      this.startTime = Date.now();
    }
    this.currentTime = Date.now() - this.startTime;
    this.currentBeat['%'] = (((this.currentTime / this.currentTempo / 60) * 4) * 100) % 100;
    const sixteenFourth = Math.floor(this.currentTime / 60 * this.currentTempo / 64);
    if (this.totalBeat['64'] !== sixteenFourth) {
      this.beatUpdate(sixteenFourth);
    }


    if ((!this.paused && !this.restartOnTrigger) || this.isTone) {
      window.requestAnimationFrame(() => {
        this.timeUpdate();
      });
    }
    this.update();
  }

  beatUpdate(sixteenFourth) {

    this.totalBeat['64'] = sixteenFourth;
    const sixteenFourthBeat = Math.floor(this.totalBeat['64'] % 64);
    this.currentBeat['64'] = sixteenFourthBeat;
    this.triggerBeat()['64']();

    for (let i = 32; i > .5; i = i / 2) {

      const beat = Math.floor(this.totalBeat[i * 2] / 2);
      if (beat !== this.totalBeat[i]) {
        this.totalBeat[i] = beat;
        this.currentBeat[i] = Math.floor(beat % i) + 1;
        this.triggerBeat()[i]();
      }
    }
    this.beatString = this.totalBeat['1'] + ': ' + this.currentBeat['2'] + '/2 ' + this.currentBeat['4'] + '/4 ' + this.currentBeat['8'] + '/8 ' + this.currentBeat['16'] + '/16 ' + this.currentBeat['32'] + '/32 ' + this.currentBeat['64'] + '/64';
    this.beatString += '  ' + this.currentTime / 1000 + 's ' + Math.floor(this.currentBeat['%']) + '%';

  }

  triggerBeat() {
    return {
      64: () => {

      },
      32: () => {

      },
      16: () => {

      },
      8: () => {
        if (this.metronome) {
          this.triggerNote('C', 1, 0, 60000 / this.currentTempo / 4);
        }
      },
      4: () => {
        if (this.metronome) {
          this.triggerNote('C', 2, 0, 60000 / this.currentTempo / 4);
        }
      },
      2: () => {

      },
      1: () => {
        if (this.metronome) {
          this.triggerNote('C', 3, 0, 60000 / this.currentTempo / 4);
        }
      }
    };
  }

  on(callback, event) {
    if (!this.callbacks[callback]) {
      this.callbacks[callback] = [];
    }
    this.callbacks[callback].push(event);
    return event;
  }

  do(callback, data: any = null) {
    if (this.callbacks[callback]) {
      for (const event of this.callbacks[callback]) {
        event(data);
      }
    }
  }

  removeCallback(callback, event) {
    if (this.callbacks[callback]) {
      for (let i = 0; i < this.callbacks[callback].length; i++) {
        if (this.callbacks[callback][i] === event) {
          this.callbacks[callback].splice(i, 1);
        }
      }
    }
  }

}

