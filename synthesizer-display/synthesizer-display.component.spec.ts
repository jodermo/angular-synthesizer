import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SynthesizerDisplayComponent } from './synthesizer-display.component';

describe('SynthesizerDisplayComponent', () => {
  let component: SynthesizerDisplayComponent;
  let fixture: ComponentFixture<SynthesizerDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SynthesizerDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SynthesizerDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
