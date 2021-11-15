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

  public static toJSON(orderBid: IOrderBid, order: IOrder, value: IShipBid, wallet_pkh: any, threadtoken: any) {

    var ob = BC_OrderBidService.toJSON(order, orderBid, orderBid.bidder, orderBid.orderBidTT)

    if (!threadtoken) {
      threadtoken = value.shipBidTT;
    }

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
  
  public async create(orderBid: IOrderBid, order: IOrder, value: IShipBid, wallet_id: string, wallet_pkh: any) {
    
    var reqData = {
      bidder: wallet_pkh,
      dateCreated: new Date(),
      shipQuantity: value.shipQuantity,
      shipCost: value.shipCost,
      shipDate: value.shipDate,
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

  public async reject(orderBid: IOrderBid, order: IOrder, value: IShipBid, wallet_pkh: string) {
    return await this.createInstance(this.capitalizeFirstLetter(this.contr), wallet_pkh).then(
      (contract) => {
        const shipBid = BC_ShipBidService.toJSON(orderBid, order, value, wallet_pkh, null);
        return this.send_request(shipBid, this.contr.toLowerCase(), contract, "reject").then(
          (response: JSON) => {
            this.shipBidService.updateStatus(value.id, {
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

  public async accept(orderBid: IOrderBid, order: IOrder, value: IShipBid, wallet_pkh: string) {
    return await this.createInstance(this.capitalizeFirstLetter(this.contr), wallet_pkh).then(
      (contract) => {
        const shipBid = BC_ShipBidService.toJSON(orderBid, order, value, wallet_pkh, null);
        return this.send_request(shipBid, this.contr.toLowerCase(), contract, "accept").then(
          (response: JSON) => {
            this.shipBidService.updateStatus(value.id, {
              status: 'ACCEPTED' as SBStatus,
            });
            console.log('Bid accepted');
          },
          error => {
            console.log('Error', error)
          }
        );
      }
    );
  }

  public async pickup(orderBid: IOrderBid, order: IOrder, value: IShipBid, wallet_pkh: string) {
    return await this.createInstance(this.capitalizeFirstLetter(this.contr), wallet_pkh).then(
      (contract) => {
        const shipBid = BC_ShipBidService.toJSON(orderBid, order, value, wallet_pkh, null);
        return this.send_request(shipBid, this.contr.toLowerCase(), contract, "pickup").then(
          (response: JSON) => {
            this.shipBidService.updateStatus(value.id, {
              status: 'PICKED UP' as SBStatus,
            });
            console.log('Product pickedup');
          },
          error => {
            console.log('Error', error)
          }
        );
      }
    );
  }

  public async cancel(orderBid: IOrderBid, order: IOrder, value: IShipBid, wallet_pkh: string) {
    return await this.createInstance(this.capitalizeFirstLetter(this.contr), wallet_pkh).then(
      (contract) => {
        const shipBid = BC_ShipBidService.toJSON(orderBid, order, value, wallet_pkh, null);
        return this.send_request(shipBid, this.contr.toLowerCase(), contract, "cancel").then(
          (response: JSON) => {
            this.shipBidService.updateStatus(value.id, {
              status: 'CANCELLED' as SBStatus,
            });
            console.log('Bid cancelled');
          },
          error => {
            console.log('Error', error)
          }
        );
      }
    );
  }

  public async deliver(orderBid: IOrderBid, order: IOrder, value: IShipBid, wallet_pkh: string) {
    return await this.createInstance(this.capitalizeFirstLetter(this.contr), wallet_pkh).then(
      (contract) => {
        const shipBid = BC_ShipBidService.toJSON(orderBid, order, value, wallet_pkh, null);
        return this.send_request(shipBid, this.contr.toLowerCase(), contract, "deliver").then(
          (response: JSON) => {
            this.shipBidService.updateStatus(value.id, {
              status: 'DELIVERED' as SBStatus,
            });
            console.log('Product delivered');
          },
          error => {
            console.log('Error', error)
          }
        );
      }
    );
  }

  public async claim(orderBid: IOrderBid, order: IOrder, value: IShipBid, wallet_pkh: string) {
    return await this.createInstance(this.capitalizeFirstLetter(this.contr), wallet_pkh).then(
      (contract) => {
        const shipBid = BC_ShipBidService.toJSON(orderBid, order, value, wallet_pkh, null);
        return this.send_request(shipBid, this.contr.toLowerCase(), contract, "claim").then(
          (response: JSON) => {
            this.shipBidService.updateStatus(value.id, {
              status: 'COMPLETED' as SBStatus,
            });
            console.log('Shipment completed');
          },
          error => {
            console.log('Error', error)
          }
        );
      }
    );
  }

}
