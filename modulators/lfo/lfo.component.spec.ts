import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LfoComponent } from './lfo.component';

describe('LfoComponent', () => {
  let component: LfoComponent;
  let fixture: ComponentFixture<LfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
