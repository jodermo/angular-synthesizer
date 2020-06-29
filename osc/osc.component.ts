import { Component, Input, AfterViewInit } from '@angular/core';
import { OSC } from '../synthesizer.service';

@Component({
  selector: 'app-osc',
  templateUrl: './osc.component.html',
  styleUrls: ['./osc.component.scss']
})
export class OscComponent implements AfterViewInit {
  @Input() osc: OSC;

  ready = false;
  currentTab;

  constructor() {
  }

  ngAfterViewInit(): void {
    this.ready = true;
  }


}
