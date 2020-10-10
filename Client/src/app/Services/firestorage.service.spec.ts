import { TestBed } from '@angular/core/testing';

import { FireStorageService } from './firestorage.service';

describe('FirestorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FireStorageService = TestBed.get(FireStorageService);
    expect(service).toBeTruthy();
  });
});
