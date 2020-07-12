import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';
import { Synthesizer } from '../../classes/synthesizer/synthesizer';

@Component({
  selector: 'app-piano-keys',
  templateUrl: './piano-keys.component.html',
  styleUrls: ['./piano-keys.component.scss']
})
export class PianoKeysComponent implements OnInit {
  @Input() startOctave = 0;
  @Input() octaves = 3;
  @Input() latch = false;
  @Input() latchControl = true;
  @Input() pitchControl = true;
  @Input() autoResetPitch = true;
  @Input() smoothPitch = true;
  @Input() pitchSpeed = 1;
  @Input() synthesizer: Synthesizer;
  @Input() currentNote;
  @Input() currentOctave;

  @Output() onKeyDown = new EventEmitter<any>();
  @Output() onKeyUp = new EventEmitter<any>();
  @Output() onLatchChange = new EventEmitter<boolean>();
  @Output() onPitchChange = new EventEmitter<number>();

  pressedKey;
  pressedOctave;

  mouseDown = false;
  pitchMouseDown = false;

  keys = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'B',
    'H'
  ];

  pitchPosition = 50;
  pitchTo = this.pitchPosition;
  pitchTimout;
  pitchInterval = 250;


  constructor(private ref: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    if (this.synthesizer && false) {
      this.synthesizer.on('playnote', (e) => {
        this.currentNote = e[0];
        this.currentOctave = e[1];
        this.ref.detectChanges();
      });
    }
  }

  isBlackKey(key: string) {
    if (key.includes('#') || key === 'B') {
      return true;
    }
    return false;
  }

  onMouseMove(key, octave) {
    if (key && (octave || octave === 0)) {
      if (!this.latch && this.mouseDown && !this.pressedKey && !this.pressedOctave) {
        this.keyDown(key, octave);
      } else if (this.mouseDown && (key !== this.pressedKey || octave !== this.pressedOctave)) {
        this.keyDown(key, octave);
      } else if (!this.latch && !this.mouseDown && this.pressedKey === key && this.pressedOctave === octave) {
        this.keyUp(this.pressedKey, this.pressedOctave);
      }
    }
  }

  clickKey(key, octave) {
    if (this.latch) {
      if (this.pressedKey !== key || this.pressedOctave !== octave) {
        this.keyDown(key, octave);
      } else {
        this.keyUp(this.pressedKey, this.pressedOctave);
      }
    } else {
      this.mouseDown = true;
      this.onMouseMove(key, octave);
    }
  }

  keyDown(key, octave) {
    this.pressedKey = key;
    this.pressedOctave = octave;
    this.onKeyDown.emit({note: key, octave});
  }

  keyUp(key, octave) {
    if (this.pressedKey === key && this.pressedOctave === octave) {
      this.pressedKey = null;
      this.pressedOctave = null;
    }
    this.onKeyUp.emit({note: key, octave});
  }

  toggleLatch() {
    this.latch = !this.latch;
    this.mouseDown = false;
    this.onLatchChange.emit(this.latch);
    this.onMouseMove(this.pressedKey, this.pressedOctave);
  }

  onPitchMouseDown(event) {
    this.pitchMouseDown = true;
    this.onPitchMouseMove(event);

  }

  onPitchMouseUp(event) {
    this.pitchMouseDown = false;
    this.onPitchMouseMove(event);
  }

  onPitchMouseMove(event) {
    if (this.pitchMouseDown && event) {
      const elm: HTMLMediaElement = event.target;
      const position = Math.floor((event.layerY / elm.clientHeight) * 100);
      if (this.smoothPitch) {
        this.pitchTo = position;
        this.updatePitch();
      } else {
        this.pitchPosition = position;
        this.pitchPositionChange();
      }
    }
  }

  pitchPositionChange() {
    const pitch = (50 - this.pitchPosition) / 50;
    this.onPitchChange.emit(pitch);
  }

  updatePitch() {
    if (this.pitchTimout) {
      clearTimeout(this.pitchTimout);
    }
    if (this.pitchTo < this.pitchPosition) {
      this.pitchPosition -= 1;
      this.pitchPositionChange();
    } else if (this.pitchTo > this.pitchPosition) {
      this.pitchPosition += 1;
      this.pitchPositionChange();
    } else {
      if (this.autoResetPitch && !this.pitchMouseDown) {
        this.pitchTo = 50;
      }
    }
    this.pitchTimout = setTimeout(() => {
      this.updatePitch();
    }, this.pitchSpeed / 100);
  }

}
