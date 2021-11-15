import { Injectable } from '@angular/core';
import { IToken } from '../../model/token';
import { IOrder } from '../../model/order';
import { IOrderBid, Status } from '../../model/orderBid';
import { ContractsService } from './contract.service';
import { BC_OrderService } from './order.service';
import { BidsService } from '../bids.service';
import { OrdersService } from '../orders.service';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class BC_OrderBidService extends ContractsService {
  private contr: string = "orderBid";

  constructor(
    protected orderService: OrdersService,
    protected bidsService: BidsService,
    protected apiService: ApiService,
    protected toastr: ToastrService
  ) {
    super(apiService, toastr);
  }
  
  public static toJSON(order: IOrder, value: any, wallet_pkh: any, threadtoken: any) : any {
    var sell_type: boolean;
    if (order.sellType == true) {
      sell_type = false;
    } else {
      sell_type = true;
    }

    if (!wallet_pkh) {
      wallet_pkh = value.bidder
    }

    var o = BC_OrderService.toJSON(order, order.orderer, order.orderTT);

    var orderbid = {
    "gobpBidder": {
        "getPubKeyHash": wallet_pkh
    },
    "gobpCostPerUnit": value.biddingPrice,
    "gobpQuantity": value.bidQuantity,
    "gobpToken": threadtoken,
    "gobpOrder": o,
      "gobpType": 
      {
          "stpSellType": !sell_type,
          "stpSelfDelivery": value.selfDelivery,
          "stpShipCost": value.shipCost,
          "stpExpectedDate": new Date(value.expectedDate).getTime(),
          "stpDeliveryDate": new Date(value.deliveryDate).getTime()
        },
      "gobpMaxReactionTime": new Date(value.maxReactionTime).getTime(),
      "gobpAction": "",
    };

    return orderbid;
  }

  public async cancel(value: IOrderBid, wallet_id: string) {
    return await this.createInstance(this.capitalizeFirstLetter(this.contr), wallet_id).then(
      (contract) => {
        const orderBid = BC_OrderBidService.toJSON(value.order, value, null, value.orderBidTT);
        return this.send_request(orderBid, this.contr.toLowerCase(), contract, "cancel").then(
          (response: JSON) => {
            this.bidsService.deleteOrderBid(value.id).subscribe(
              (data) => {
                this.orderService.updateOrderBid(value.order.id, {
                  bids: 0,
                  bidder: undefined,
                });
                console.log('Cancelled successfully', data);
              },
              (err) => {
                this.toastr.error('Some Error Occured!', 'FAILED!');
              }
            );
          }
        );
      }
    );
  }

  public async accept(value: IOrderBid, wallet_id: string) {
    return await this.createInstance(this.capitalizeFirstLetter(this.contr), wallet_id).then(
      (contract) => {
        const orderBid = BC_OrderBidService.toJSON(value.order, value, null, value.orderBidTT);
        return this.send_request(orderBid, this.contr.toLowerCase(), contract, "accept").then(
          (response: JSON) => {
            this.bidsService.updateBidStatus(value.id, {
              status: 'ACCEPTED' as Status,
            });
            console.log('Bid accepted')
          },
          error => {
            console.log('Error', error)
          }
        );
      }
    );
  }

  public async pickup(value: IOrderBid, wallet_id: string) {
    return await this.createInstance(this.capitalizeFirstLetter(this.contr), wallet_id).then(
      (contract) => {
        const orderBid = BC_OrderBidService.toJSON(value.order, value, null, value.orderBidTT);
        return this.send_request(orderBid, this.contr.toLowerCase(), contract, "pickup").then(
          (response: JSON) => {
            this.bidsService.updateBidStatus(value.id, {
              status: 'PICKED_UP' as Status,
            });
            console.log('Product picked up');
          },
          error => {
            console.log('Error', error)
          }
        );
      }
    );
  }

  public async reject(value: IOrderBid, wallet_id: string) {
    return await this.createInstance(this.capitalizeFirstLetter(this.contr), wallet_id).then(
      (contract) => {
        const orderBid = BC_OrderBidService.toJSON(value.order, value, null, value.orderBidTT);
        return this.send_request(orderBid, this.contr.toLowerCase(), contract, "reject").then(
          (response: JSON) => {
            this.bidsService.updateBidStatus(value.id, {
              status: 'REJECTED' as Status,
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

  public async create(order: IOrder, value: any, wallet_id: string, wallet_pkh: any) {
    
    let stat: string = "PENDING";

    let bidStatus: Status = stat as Status;

    var reqData = {
      order: order,
      bidder: wallet_pkh,
      biddingPrice: value.biddingPrice,
      bidQuantity: value.bidQuantity,
      maxReactionTime: value.maxReactionTime,
      bidDate: new Date(),

      sellType: !order.sellType,
      selfDelivery: value.selfDelivery,
      shipCost: value.shipCost,
      expectedDate: value.expectedDate,
      deliveryDate: value.deliveryDate,

      status: bidStatus,
      
      orderBidTT: null
    };
    
    return await this.createInstance(this.capitalizeFirstLetter(this.contr), wallet_id).then(
      (contract) => {
        const orderBid = BC_OrderBidService.toJSON(order, value, wallet_pkh, null);
        return this.send_request(orderBid, this.contr.toLowerCase(), contract, "create").then(
          (response: JSON) => {
            this.get_thread_token(contract).then(
              (token: IToken) => {
                reqData.orderBidTT = token
                this.bidsService.addNewBid(reqData).subscribe(
                  (data) => {
                    order.bids += reqData.bidQuantity;
                    // order.bidder = wallet_pkh;
                    this.orderService
                      .updateOrder(order.id, order)
                      .subscribe(
                        (data: Array<IOrder>) => {
                          order = undefined;
                        },
                        (err) => {
                          this.toastr.error('Some Error Occured!', err);
                        }
                      );
                  },
                  (error) => {
                    console.log('Could not create OrderBid', error)
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
      this.toastr.error('Some Error Occured!', err);
    }
    );
  }

}
