import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrequencyFilterCanvasComponent } from './frequency-filter-canvas.component';

describe('FrequencyFilterCanvasComponent', () => {
  let component: FrequencyFilterCanvasComponent;
  let fixture: ComponentFixture<FrequencyFilterCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrequencyFilterCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrequencyFilterCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
