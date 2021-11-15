import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipbidsComponent } from './shipbids.component';

describe('ShipbidsComponent', () => {
  let component: ShipbidsComponent;
  let fixture: ComponentFixture<ShipbidsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipbidsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipbidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
