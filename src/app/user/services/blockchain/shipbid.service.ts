import { Injectable } from '@angular/core';
import { IOrder } from '../../model/order';
import { IToken } from '../../model/token';
import { IOrderBid } from '../../model/orderBid';
import { ContractsService } from './contract.service';
import { BC_OrderBidService } from './orderbid.service';
import { ShipBidService } from '../shipbids.service';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { IShipBid, SBStatus } from '../../model/shipBid';

@Injectable({
  providedIn: 'root'
})
export class BC_ShipBidService extends ContractsService {
  private contr: string = "shipBid";

  constructor(
    protected shipBidService: ShipBidService,
    protected apiService: ApiService,
    protected toastr: ToastrService
  ) {
    super(apiService, toastr);
  }

  public static toJSON(orderBid: IOrderBid, order: IOrder, value: any, wallet_pkh: any, threadtoken: any) {

    var ob = BC_OrderBidService.toJSON(order, orderBid, orderBid.bidder, orderBid.orderBidTT)

    var shipBid = {
      "gsbpMaxReactionTime": value.maxReactionTime,
      "gsbpShipmentCost": value.shipCost,
      "gsbpShipDate": value.shipDate,
      "gsbpOrderBid": ob,
      "gsbpBidder": {
          "getPubKeyHash": wallet_pkh
      },
      "gsbpToken": threadtoken,
      "gsbpQuantity": value.shipQuantity
    }

    return shipBid;
  }
  
  public async create(order: IOrder, orderBid: IOrderBid, value: any, wallet_id: string, wallet_pkh: any) {
    
    var reqData = {
      bidder: wallet_pkh,
      dateCreated: new Date(),
      shipQuantity: value.shipQuantity,
      shipCost: value.shipCost,
      shipDate: Date,
      shipBidTT: null,
      maxReactionTime: value.maxReactionTime
    };

    Object.assign(reqData, { status: 'PENDING' });
    var contr: string = "shipBid";
    
    return await this.createInstance(this.capitalizeFirstLetter(contr), wallet_id).then(
      (contract) => {
        const shipBid = BC_ShipBidService.toJSON(orderBid, order, value, wallet_pkh, null);
        return this.send_request(shipBid, contr, contract, "create").then(
          (response: JSON) => {
            this.get_thread_token(contract).then(
              (token: IToken) => {
                reqData.shipBidTT = token
                this.shipBidService.addNew(reqData).subscribe(
                  (data) => {
                    console.log('ShipBid sent', data)
                  },
                  (error) => {
                    console.log('Could not create ShipBid', error)
                  }
                )
              },
              (error) => {
                console.log('Problem fetching ThreadToken', error)
              }
            );
          },
          (error) => {
            console.log('My error', error);
          }
        );      
    },
    (err) => {
      this.toastr.error('Some Error Occured!', 'FAILED!');
    }
    );
  }

  public async reject(value: IShipBid, wallet_id: string) {
    return await this.createInstance(this.capitalizeFirstLetter(this.contr), wallet_id).then(
      (contract) => {
        const orderBid = BC_OrderBidService.toJSON(value.order, value, null, value.orderBidTT);
        return this.send_request(orderBid, this.contr.toLowerCase(), contract, "reject").then(
          (response: JSON) => {
            this.shipBidService.update(value.id, {
              status: 'REJECTED' as SBStatus,
            });
            console.log('Bid rejected');
          },
          error => {
            console.log('Error', error)
          }
        );
      }
    );
  }

}
