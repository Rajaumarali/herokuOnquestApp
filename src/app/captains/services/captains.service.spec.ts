import { TestBed } from '@angular/core/testing';

import { CaptainsService } from './captains.service';

describe('CaptainsService', () => {
  let service: CaptainsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaptainsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
