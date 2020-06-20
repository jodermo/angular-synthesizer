import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SynthesizerComponent } from './synthesizer.component';

describe('SynthesizerComponent', () => {
  let component: SynthesizerComponent;
  let fixture: ComponentFixture<SynthesizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SynthesizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SynthesizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
