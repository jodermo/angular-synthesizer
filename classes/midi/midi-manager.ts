import { MIDIController } from './midi-controller';

export class MIDIManager {

  inputs;
  outputs;
  inputControllers: MIDIController[] = [];
  outputControllers: MIDIController[] = [];

  constructor(public synthesizer) {
    if ((navigator as any).requestMIDIAccess) {
      (navigator as any).requestMIDIAccess().then((e) => {
        this.onMIDISuccess(e);
      }, this.onMIDIFailure);
    } else {
      this.onMIDIFailure();
    }
  }

  onMIDISuccess(midiAccess) {
    this.inputs = midiAccess.inputs;
    this.outputs = midiAccess.outputs;
    for (const input of midiAccess.inputs.values()) {
      this.updateMidiInput(input);
    }
    for (const output of midiAccess.outputs.values()) {
      this.updateMidiOutput(output);
    }
    midiAccess.onstatechange = (e) => {
      this.updateMidiInput(e.port);
    };
  }

  updateMidiInput(input) {
    let exist = false;
    for (const controller of this.inputControllers) {
      if (controller.id === input.id) {
        controller.name = name;
        controller.input = input;
        exist = true;
      }
    }
    if (!exist) {
      this.inputControllers.push(new MIDIController(input, this.synthesizer));
    }
  }

  updateMidiOutput(output) {
    let exist = false;
    for (const controller of this.inputControllers) {
      if (controller.id === output.id) {
        controller.name = name;
        controller.input = output;
        exist = true;
      }
    }
    if (!exist) {
      this.outputControllers.push(new MIDIController(output, this.synthesizer));
    }
  }

  onMIDIFailure() {
    console.log('no midi support');
  }

}
