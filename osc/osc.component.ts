import { Component, EventEmitter, Input, AfterViewInit, Output } from '@angular/core';
import { OSC, SynthesizerNode } from '../synthesizer.service';

@Component({
  selector: 'app-osc',
  templateUrl: './osc.component.html',
  styleUrls: ['./osc.component.scss']
})
export class OscComponent implements AfterViewInit {
  @Input() osc: OSC;

  @Output() onConnectNode = new EventEmitter<any>();

  constructor() {
  }

  ngAfterViewInit(): void {

  }


  connectNode(node: SynthesizerNode, target) {

    let exist = false
    for (const nodeTarget of node.targets) {
      if (nodeTarget === target) {
        exist = true;
      }
    }
    if (!exist) {
      node.targets.push(target);
      if (this.osc.synthesizer.connectNode) {
        node.source = this.osc.synthesizer.connectNode;
        this.osc.synthesizer.connectNode = null;
      }
      this.sendConnectNode(node);
    }


  }

  sendConnectNode(node: SynthesizerNode) {
    this.onConnectNode.emit(node);
  }
}
