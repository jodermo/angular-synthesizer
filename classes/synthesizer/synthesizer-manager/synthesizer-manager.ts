
import { SynthesizerLfo, SynthesizerLfoSaveData } from '../synthesizer-modulator/synthesizer-modulators/synthesizer-lfo';
import { SynthesizerSequencer } from '../synthesizer-modulator/synthesizer-modulators/synthesizer-sequencer';
import { SynthesizerOsc, SynthesizerOscSaveData } from '../synthesizer-osc/synthesizer-osc';
import { SynthesizerSaveData } from '../save-data/save-data';

export class SynthesizerManager {
  loading = false;
  saving = false;

  constructor(public synthesizer) {

  }


  loadSynthesizer(saveData: SynthesizerSaveData) {
    for (const key in saveData) {
      if (key === 'oscs') {
        let osc: SynthesizerOsc;
        for (let i = 0; i < saveData[key].length; i++) {
          if (!this.synthesizer.oscs[i]) {
            osc = this.synthesizer.addOsc(i + 1);
          }
          // tslint:disable-next-line:forin
          for (const oscKey in saveData[key][i]) {
            this.synthesizer.oscs[i][oscKey] = saveData[key][i][oscKey];
          }
          this.synthesizer.oscs[i].update();
        }
      } else if (key === 'lfos') {
        let lfo: SynthesizerLfo;
        for (let i = 0; i < saveData[key].length; i++) {
          if (!this.synthesizer.lfos[i]) {
            lfo = this.synthesizer.addLfo(i + 1);
          }
          // tslint:disable-next-line:forin
          for (const lfoKey in saveData[key][i]) {
            this.synthesizer.lfos[i][lfoKey] = saveData[key][i][lfoKey];
          }
          this.synthesizer.lfos[i].update();
        }
      } else if (key === 'sequencer') {
        let sequencer: SynthesizerSequencer;
        for (let i = 0; i < saveData[key].length; i++) {
          if (!this.synthesizer.lfos[i]) {
            sequencer = this.synthesizer.addSequencer(i + 1);
          }
          // tslint:disable-next-line:forin
          for (const sequencerKey in saveData[key][i]) {
            this.synthesizer.sequencers[i][sequencerKey] = saveData[key][i][sequencerKey];
          }
          this.synthesizer.sequencers[i].update();
        }
      } else {
        this.synthesizer[key] = saveData[key];
      }
    }
    this.synthesizer.do('onload', saveData);
  }

  saveSynthesizer() {
    if (!this.saving && confirm('You want to save this modulation?')) {
      this.saving = true;

      const saveData = new SynthesizerSaveData();
      for (const key in saveData) {
        if (key !== 'lfos' && key !== 'oscs') {
          saveData[key] = this.synthesizer[key];
        }
      }
      for (const osc of this.synthesizer.oscs) {
        const saveDataOsc = new SynthesizerOscSaveData();
        // tslint:disable-next-line:forin
        for (const key in saveDataOsc) {
          saveDataOsc[key] = osc[key];
        }
        saveData.oscs.push(saveDataOsc);
      }
      for (const lfo of this.synthesizer.lfos) {
        const saveDataLfo = new SynthesizerLfoSaveData();
        // tslint:disable-next-line:forin
        for (const key in saveDataLfo) {
          saveDataLfo[key] = lfo[key];
        }
        saveData.lfos.push(saveDataLfo);
      }
      this.saveLocalStorage(this.synthesizer, saveData);
      this.synthesizer.do('onsave', saveData);
      alert('Modulation saved');
    }

  }

  getLocalStorage() {
    let savedData: any = localStorage.getItem('synthesizer-data');
    if (savedData) {
      savedData = JSON.parse(savedData);
      const saveData = new SynthesizerSaveData();
      for (const key in savedData) {
        if (key !== 'lfos' && key !== 'oscs') {
          saveData[key] = savedData[key];
        }
      }
      if (savedData.oscs) {
        for (const osc of savedData.oscs) {
          const saveDataOsc = new SynthesizerOscSaveData();
          // tslint:disable-next-line:forin
          for (const key in saveDataOsc) {
            saveDataOsc[key] = osc[key];
          }
          saveData.oscs.push(saveDataOsc);
        }
      }
      if (savedData.oscs) {
        for (const lfo of savedData.lfos) {
          const saveDataLfo = new SynthesizerLfoSaveData();
          // tslint:disable-next-line:forin
          for (const key in saveDataLfo) {
            saveDataLfo[key] = lfo[key];
          }
          saveData.lfos.push(saveDataLfo);
        }
      }
      this.loadSynthesizer(savedData);
    }
  }

  saveLocalStorage(synthesizer: any, saveData) {
    localStorage.setItem('synthesizer-data', JSON.stringify(saveData));
  }

  clearLocalStorage(synthesizer: any) {
    localStorage.removeItem('synthesizer-data');
  }

}
