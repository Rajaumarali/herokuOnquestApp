import { TestBed } from '@angular/core/testing';

import { ResidentAllPropertylistingService } from './residentlisting.service';

describe('ResidentlistingService', () => {
  let service: ResidentAllPropertylistingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResidentAllPropertylistingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
