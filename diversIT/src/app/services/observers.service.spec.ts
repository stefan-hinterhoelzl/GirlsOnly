import { TestBed } from '@angular/core/testing';

import { ObserversService } from './observers.service';

describe('ObserversService', () => {
  let service: ObserversService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObserversService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
