import { TestBed } from '@angular/core/testing';

import { PersistentdataService } from './persistentdata.service';

describe('PersistentdataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PersistentdataService = TestBed.get(PersistentdataService);
    expect(service).toBeTruthy();
  });
});
