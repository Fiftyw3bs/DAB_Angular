import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IShipBid } from '../../model/shipBid';
import { BC_ShipBidService } from '../../services/blockchain/shipbid.service';
import { HelperService } from './../../../services/helper.service';

@Component({
  selector: 'app-shipbids',
  templateUrl: './shipbids.component.html',
  styleUrls: ['./shipbids.component.scss']
})
export class ShipbidsComponent implements OnInit {
  public all_shipbid_data: Array<IShipBid>;
  public single_shipbid_data: IShipBid;
  public addEditShipBidForm: FormGroup;
  public wallet_pkh: string;
  public popup_header: string;

  constructor(
    public helperService: HelperService,
    public blockchainShipBidService: BC_ShipBidService
  ) {
    this.wallet_pkh = JSON.parse(JSON.stringify(this.helperService.isLoggedIn.value.wallet)).wiPubKeyHash.getPubKeyHash;
  }

  ngOnInit(): void {
  }

  /**
   * deleteShipBid
   */
  public deleteShipBid() {
    
  }

  /**
   * acceptShipBid
   */
  public acceptShipBid() {
    
  }

  /**
   * rejectShipBid
   */
  public rejectShipBid() {
    
  }



}
