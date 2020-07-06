import { Synthesizer, SynthesizerSaveData } from './synthesizer';
import { SynthesizerOsc, SynthesizerOscSaveData } from './synthesizer-osc';
import { SynthesizerLfo, SynthesizerLfoSaveData } from './synthesizer-lfo';
import { SynthesizerSequencer } from './synthesizer-sequencer';

export class SynthesizerManager {
  loading = false;
  saving = false;

  constructor() {

  }


  loadSynthesizer(synthesizer: Synthesizer, saveData: SynthesizerSaveData) {
    for (const key in saveData) {
      if (key === 'oscs') {
        let osc: SynthesizerOsc;
        for (let i = 0; i < saveData[key].length; i++) {
          if (!synthesizer.oscs[i]) {
            osc = synthesizer.addOsc(i + 1);
          }
          // tslint:disable-next-line:forin
          for (const oscKey in saveData[key][i]) {
            synthesizer.oscs[i][oscKey] = saveData[key][i][oscKey];
          }
          synthesizer.oscs[i].update();
        }
      } else if (key === 'lfos') {
        let lfo: SynthesizerLfo;
        for (let i = 0; i < saveData[key].length; i++) {
          if (!synthesizer.lfos[i]) {
            lfo = synthesizer.addLfo(i + 1);
          }
          // tslint:disable-next-line:forin
          for (const lfoKey in saveData[key][i]) {
            synthesizer.lfos[i][lfoKey] = saveData[key][i][lfoKey];
          }
          synthesizer.lfos[i].update();
        }
      } else if (key === 'sequencer') {
        let sequencer: SynthesizerSequencer;
        for (let i = 0; i < saveData[key].length; i++) {
          if (!synthesizer.lfos[i]) {
            sequencer = synthesizer.addSequencer(i + 1);
          }
          // tslint:disable-next-line:forin
          for (const sequencerKey in saveData[key][i]) {
            synthesizer.sequencers[i][sequencerKey] = saveData[key][i][sequencerKey];
          }
          synthesizer.sequencers[i].update();
        }
      } else {
        synthesizer[key] = saveData[key];
      }
    }
    synthesizer.do('onload', saveData);
  }

  saveSynthesizer(synthesizer: Synthesizer) {
    if (!this.saving && confirm('You want to save this modulation?')) {
      this.saving = true;

      const saveData = new SynthesizerSaveData();
      for (const key in saveData) {
        if (key !== 'lfos' && key !== 'oscs') {
          saveData[key] = synthesizer[key];
        }
      }
      for (const osc of synthesizer.oscs) {
        const saveDataOsc = new SynthesizerOscSaveData();
        // tslint:disable-next-line:forin
        for (const key in saveDataOsc) {
          saveDataOsc[key] = osc[key];
        }
        saveData.oscs.push(saveDataOsc);
      }
      for (const lfo of synthesizer.lfos) {
        const saveDataLfo = new SynthesizerLfoSaveData();
        // tslint:disable-next-line:forin
        for (const key in saveDataLfo) {
          saveDataLfo[key] = lfo[key];
        }
        saveData.lfos.push(saveDataLfo);
      }
      this.saveLocalStorage(synthesizer, saveData);
      synthesizer.do('onsave', saveData);
      alert('Modulation saved');
    }

  }

  getLocalStorage(synthesizer: Synthesizer) {
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
      this.loadSynthesizer(synthesizer, savedData);
    }
  }

  saveLocalStorage(synthesizer: Synthesizer, saveData) {
    localStorage.setItem('synthesizer-data', JSON.stringify(saveData));
  }

  clearLocalStorage(synthesizer: Synthesizer) {
    localStorage.removeItem('synthesizer-data');
  }

}
