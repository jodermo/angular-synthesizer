import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistortionComponent } from './distortion.component';

describe('DistortionComponent', () => {
  let component: DistortionComponent;
  let fixture: ComponentFixture<DistortionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistortionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistortionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
