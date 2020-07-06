import { Injectable } from '@angular/core';
import { Synthesizer } from './classes/synthesizer';
import { AudioLayer } from './classes/audio-layer';

@Injectable({
  providedIn: 'root'
})
export class SynthesizerService {

  layers: AudioLayer[];
  synthesizers: Synthesizer[];

  constructor() {
  }

  addLayer() {
    const layer = new AudioLayer();
    this.layers.push(layer);
    return layer;
  }

}




