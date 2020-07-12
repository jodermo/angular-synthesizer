import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OscEffectComponent } from './osc-effect.component';

describe('OscEffectComponent', () => {
  let component: OscEffectComponent;
  let fixture: ComponentFixture<OscEffectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OscEffectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OscEffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
