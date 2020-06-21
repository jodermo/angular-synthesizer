import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveformCanvasComponent } from './waveform-canvas.component';

describe('WaveformCanvasComponent', () => {
  let component: WaveformCanvasComponent;
  let fixture: ComponentFixture<WaveformCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaveformCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaveformCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
