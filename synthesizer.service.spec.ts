import { TestBed } from '@angular/core/testing';

import { SynthesizerService } from './synthesizer.service';

describe('SynthesizerService', () => {
  let service: SynthesizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SynthesizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
