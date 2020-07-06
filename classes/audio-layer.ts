export class AudioLayer {
  audioContext: AudioContext;

  constructor(public audio: HTMLAudioElement = null) {
    if (!this.audio) {
      this.audio = new Audio();
    }
    this.audioContext = new AudioContext();
  }

}
