import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SynthesizerSettingsComponent } from './synthesizer-settings.component';

describe('SynthesizerSettingsComponent', () => {
  let component: SynthesizerSettingsComponent;
  let fixture: ComponentFixture<SynthesizerSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SynthesizerSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SynthesizerSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
