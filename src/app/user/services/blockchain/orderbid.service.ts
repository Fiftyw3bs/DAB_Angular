import { Injectable } from '@angular/core';
import { IToken } from '../../model/token';
import { IOrder } from '../../model/order';
import { IBid, Status } from '../../model/orderBid';
import { ContractsService } from './contract.service';

@Injectable({
  providedIn: 'root'
})
export class OrderBidService extends ContractsService {
  private contr: string = "orderBid";

  super() {
  }
  
  private toJSON(order: IOrder, value: any, wallet_pkh: string, threadtoken: any) : any {
    var sell_type: boolean;
    if (order.sellType == true) {
      sell_type = false;
    } else {
      sell_type = true;
    }
    var orderbid = {
    "gobpBidder": {
        "getPubKeyHash": wallet_pkh
    },
    "gobpCostPerUnit": value.biddingPrice,
    "gobpQuantity": value.bidQuantity,
    "gobpToken": threadtoken,
    "gobpOrder": 
    {
        "gopQuantity": order.quantity,
        "gopToken":  order.orderTT,
        "gopUnit": order.unit,
        "gopOwner": {
            "getPubKeyHash": order.orderer
        },
        "gopProduct": {
            "unTokenName": JSON.parse(JSON.stringify(order.product)).name
        },
        "gopAcceptedCurrSymbol": {
            "unCurrencySymbol": ""
        },
        "gopCostPerUnit": order.costPerUnit,
        "gopAcceptedTokenName": {
            "unTokenName": ""
        },
        "gopType": 
        {
            "stpSellType": sell_type,
            "stpSelfDelivery": order.selfDelivery,
            "stpShipCost": order.shipCost,
            "stpExpectedDate": new Date(order.expectedDate).getTime(),
            "stpDeliveryDate": new Date(order.deliveryDate).getTime()
        },
        "gopAction": "a5",
      },
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
        const orderBid = this.toJSON(order, value, wallet_pkh, null);
        return this.send_request(orderBid, this.contr.toLowerCase(), contract, "create").then(
          (response: JSON) => {
            this.get_thread_token(contract).then(
              (token: IToken) => {
                reqData.orderBidTT = token
                this.bidsService.addNewBid(reqData).subscribe(
                  (data) => {
                    order.bids = reqData.bidQuantity;
                    order.bidder = wallet_pkh;
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
