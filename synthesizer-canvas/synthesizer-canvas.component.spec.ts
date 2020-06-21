import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SynthesizerCanvasComponent } from './synthesizer-canvas.component';

describe('SynthesizerCanvasComponent', () => {
  let component: SynthesizerCanvasComponent;
  let fixture: ComponentFixture<SynthesizerCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SynthesizerCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SynthesizerCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
