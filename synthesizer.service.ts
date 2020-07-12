import { Injectable } from '@angular/core';
import { Synthesizer } from './classes/synthesizer/synthesizer';

@Injectable({
  providedIn: 'root'
})
export class SynthesizerService {


  synthesizers: Synthesizer[];

  constructor() {
  }


}




