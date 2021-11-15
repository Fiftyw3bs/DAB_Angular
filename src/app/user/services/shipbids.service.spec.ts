import { TestBed } from '@angular/core/testing';

import { ShipBidService } from './bids.service';

describe('ShipBidService', () => {
  let service: ShipBidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShipBidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
