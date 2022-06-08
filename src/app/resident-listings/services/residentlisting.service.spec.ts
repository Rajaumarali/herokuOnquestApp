import { TestBed } from '@angular/core/testing';

import { ResidentlistingService } from './residentlisting.service';

describe('ResidentlistingService', () => {
  let service: ResidentlistingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResidentlistingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
