import { TestBed } from '@angular/core/testing';

import { OrderbidService } from './orderbid.service';

describe('OrderbidService', () => {
  let service: OrderbidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderbidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
