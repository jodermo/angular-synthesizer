import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SequencerCanvasComponent } from './sequencer-canvas.component';

describe('SequencerCanvasComponent', () => {
  let component: SequencerCanvasComponent;
  let fixture: ComponentFixture<SequencerCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SequencerCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SequencerCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
