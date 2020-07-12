import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MidiControlsComponent } from './midi-controls.component';

describe('MidiControlsComponent', () => {
  let component: MidiControlsComponent;
  let fixture: ComponentFixture<MidiControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MidiControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MidiControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
