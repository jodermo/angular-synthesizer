import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OscEffectControlComponent } from './osc-effect-control.component';

describe('OscEffectControlComponent', () => {
  let component: OscEffectControlComponent;
  let fixture: ComponentFixture<OscEffectControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OscEffectControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OscEffectControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
