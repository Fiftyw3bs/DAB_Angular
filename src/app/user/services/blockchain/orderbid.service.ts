import { Injectable } from '@angular/core';
import { ContractsService } from './contract.service';

@Injectable({
  providedIn: 'root'
})
export class OrderbidService extends ContractsService {

  super() {
  }

  
  private toJSON(value: any, wallet_pkh: string, threadtoken: any) : any {
    var sell_type: boolean;
    if (value.sellType == "true") {
      sell_type = true;
    } else {
      sell_type = false;
    }
    var order = {
        "gopQuantity": value.quantity,
        "gopToken":  threadtoken,
        "gopUnit": value.unit,
        "gopOwner": {
            "getPubKeyHash": wallet_pkh
        },
        "gopProduct": {
            "unTokenName": JSON.parse(value.product).name
        },
        "gopAcceptedCurrSymbol": {
            "unCurrencySymbol": ""
        },
        "gopCostPerUnit": value.costPerUnit,
        "gopAcceptedTokenName": {
            "unTokenName": ""
        },
        "gopType": 
        {
            "stpSellType": sell_type,
            "stpSelfDelivery": value.selfDelivery,
            "stpShipCost": value.shipCost,
            "stpExpectedDate": new Date(value.expectedDate).getTime(),
            "stpDeliveryDate": new Date(value.deliveryDate).getTime()
        },
        "gopAction": "a5",
    };

    return order;
  }

  public async create(value: any, wallet_id: string, wallet_pkh: any) {
    
    var reqData = {
      product: JSON.parse(value.product).name,
      sellType: value.sellType,
      selfDelivery: value.selfDelivery,
      shipCost: value.shipCost,
      expectedDate: value.expectedDate,
      deliveryDate: value.deliveryDate,
      quantity: value.quantity,
      unit: value.unit,
      costPerUnit: value.costPerUnit,
      dateCreated: new Date(),
      orderer: wallet_pkh,
      tt: null
    };

    Object.assign(reqData, { status: 'PENDING' });
    var contr: string = "order";
    
    return await this.createInstance(this.capitalizeFirstLetter(contr), wallet_id).then(
      (contract) => {
        const order = this.toJSON(value, wallet_pkh, null);
        return this.send_request(order, contr, contract, "create").then(
          (response: JSON) => {
            this.get_thread_token(contract).then(
              (token: IToken) => {
                reqData.tt = token
                this.orderService.addNewOrder(reqData).subscribe(
                  (data) => {
                    console.log('Order sent', data)
                  },
                  (error) => {
                    console.log('Could not create Order', error)
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

}
