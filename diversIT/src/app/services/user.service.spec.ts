import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';

describe('FirestoreService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
