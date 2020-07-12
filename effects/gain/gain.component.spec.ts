import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GainComponent } from './gain.component';

describe('GainComponent', () => {
  let component: GainComponent;
  let fixture: ComponentFixture<GainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
