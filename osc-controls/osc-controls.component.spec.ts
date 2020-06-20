import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OscControlsComponent } from './osc-controls.component';

describe('OscControlsComponent', () => {
  let component: OscControlsComponent;
  let fixture: ComponentFixture<OscControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OscControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OscControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
