import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PianoKeysComponent } from './piano-keys.component';

describe('PianoKeysComponent', () => {
  let component: PianoKeysComponent;
  let fixture: ComponentFixture<PianoKeysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PianoKeysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PianoKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
