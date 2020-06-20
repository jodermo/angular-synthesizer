import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SynthesizerControlComponent } from './synthesizer-control.component';

describe('SynthesizerControlComponent', () => {
  let component: SynthesizerControlComponent;
  let fixture: ComponentFixture<SynthesizerControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SynthesizerControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SynthesizerControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
