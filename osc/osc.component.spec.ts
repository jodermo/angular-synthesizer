import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OscComponent } from './osc.component';

describe('OscComponent', () => {
  let component: OscComponent;
  let fixture: ComponentFixture<OscComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OscComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
