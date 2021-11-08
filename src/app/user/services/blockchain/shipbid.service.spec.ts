import { TestBed } from '@angular/core/testing';

import { ShipbidService } from './shipbid.service';

describe('ShipbidService', () => {
  let service: ShipbidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShipbidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
