import { Component, OnInit } from '@angular/core';
import { IShipBid } from '../../model/shipBid';

@Component({
  selector: 'app-shipbids',
  templateUrl: './shipbids.component.html',
  styleUrls: ['./shipbids.component.scss']
})
export class ShipbidsComponent implements OnInit {
  public all_shipbid_data: Array<IShipBid>;
  public single_shipbid_data: IShipBid;

  constructor() { }

  ngOnInit(): void {
  }

}
