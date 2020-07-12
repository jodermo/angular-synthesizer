import { Synthesizer } from '../synthesizer/synthesizer';

export class MIDIController {
  id;
  name;
  active = false;
  callbacks: any = {};
  keysPressed = 0;

  midiValues = {
    c: [24, 36, 48, 60, 72, 523.25, 1046.50, 2093.00, 4186.01],
    c2: [25, 37, 49, 61, 73, 554.37, 1108.73, 2217.46, 4434.92],
    d: [26, 38, 50, 62, 293.66, 587.33, 1174.66, 2349.32, 4698.64],
    d2: [27, 39, 51, 63, 311.13, 622.25, 1244.51, 2489.02, 4978.03],
    e: [28, 40, 52, 64, 329.63, 659.26, 1318.51, 2637.02],
    f: [29, 41, 53, 65, 349.23, 698.46, 1396.91, 2793.83],
    f2: [30, 42, 54, 66, 369.99, 739.99, 1479.98, 2959.96],
    g: [31, 43, 55, 67, 392.00, 783.99, 1567.98, 3135.96],
    g2: [32, 44, 56, 68, 415.30, 830.61, 1661.22, 3322.44],
    a: [33, 45, 57, 69, 440.00, 880.00, 1760.00, 3520.00],
    b: [34, 46, 58, 70, 466.16, 932.33, 1864.66, 3729.31],
    h: [35, 47, 59, 71, 493.88, 987.77, 1975.53, 3951.07]
  };

  constructor(public input, public synthesizer: Synthesizer = null) {
    this.id = input.id;
    this.name = input.name;
    this.input.onmidimessage = (e) => {
      if (this.active) {
        this.getMIDIMessage(e);
      }
    };
    this.getLocalStorage();
  }

  setActive() {
    if (!this.active) {
      if (!this.isInLocalStorage()) {
        this.saveToLocalStorage();
      }
      this.active = true;
    }
  }

  setInactive() {
    this.active = false;
    this.isInLocalStorage(true);
  }

  toggleActive() {
    if (!this.active) {
      this.setActive();
    } else {
      this.setInactive();
    }
  }

  saveToLocalStorage() {
    let activeControllers: any = localStorage.getItem('active-midi-controller');
    if (activeControllers) {
      activeControllers = JSON.parse(activeControllers);
    } else {
      activeControllers = [];
    }
    activeControllers.push({id: this.input.id, name: this.input.name});
    localStorage.setItem('active-midi-controller', JSON.stringify(activeControllers));
  }

  isInLocalStorage(removeAndSave = false) {
    let activeControllers: any = localStorage.getItem('active-midi-controller');
    if (activeControllers) {
      activeControllers = JSON.parse(activeControllers);
    } else {
      activeControllers = [];
    }
    for (let i = 0; i < activeControllers.length; i++) {
      if (activeControllers[i].id === this.input.id && activeControllers[i].name === this.input.name) {
        if (removeAndSave) {
          activeControllers.splice(i, 1);
          localStorage.setItem('active-midi-controller', JSON.stringify(activeControllers));
        }
        return true;
      }
    }
    return false;
  }

  getLocalStorage() {
    let activeControllers: any = localStorage.getItem('active-midi-controller');
    if (activeControllers) {
      activeControllers = JSON.parse(activeControllers);
      for (const controller of activeControllers) {
        if (controller.id === this.input.id && controller.name === this.input.name) {
          return this.setActive();
        }

      }
      return this.setInactive();
    }
  }

  getMIDIMessage(message) {
    const command = message.data[0];
    const note = message.data[1];
    const velocity = (message.data.length > 2) ? message.data[2] : 0;
    // console.log('command', command);
    // console.log('note', note);
    // console.log('velocity', velocity);
    switch (command) {
      case 144:
        if (velocity > 0) {
          this.keyDown(note, velocity);
        } else {
          this.keyUp(note);
        }
        break;
      case 128:
        this.keyUp(note);
        break;
      case 224:
        this.pitchChange(note, velocity);
        break;
    }
  }

  keyDown(midiNumber, velocity) {
    this.keysPressed++;
    // tslint:disable-next-line:forin
    for (const note in this.midiValues) {
      for (let i = 0; i < this.midiValues[note].length; i++) {
        if (midiNumber === this.midiValues[note][i]) {
          this.playMidiNote(note, i + 1);
        }
      }
    }
  }

  keyUp(midiNumber) {
    this.keysPressed--;
    if (this.keysPressed <= 0) {
      if (this.synthesizer) {
        this.synthesizer.stopTone();
      }
    }
  }

  playMidiNote(note, octave) {
    if (this.synthesizer) {
      this.synthesizer.playNote(note, octave);
    }
  }

  pitchChange(note, velocity) {
    const pitch = note - velocity;
    // this.synthesizer.pitch(pitch / 64)
  }

  on(callback, event) {
    if (!this.callbacks[callback]) {
      this.callbacks[callback] = [];
    }
    this.callbacks[callback].push(event);
  }

  do(callback, data) {
    if (this.active && this.callbacks[callback]) {
      for (const event of this.callbacks[callback]) {
        event(data);
      }
    }
  }
}
