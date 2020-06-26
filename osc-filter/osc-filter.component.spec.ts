import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OscFilterComponent } from './osc-filter.component';

describe('OscFilterComponent', () => {
  let component: OscFilterComponent;
  let fixture: ComponentFixture<OscFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OscFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OscFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
