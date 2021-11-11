import { Component, OnInit } from '@angular/core';
import { IOrder } from '../../model/order';
import { OrdersComponent } from '../orders/orders.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './../orders/orders.component.html',
  styleUrls: [
    './transactions.component.scss',
    '../orders/orders.component.scss'
  ]
})
export class TransactionsComponent extends OrdersComponent {

  super() { }

  ngOnInit(): void {
    this.all_order_data = new Array<IOrder>();
    var wallet_pkh = JSON.parse(JSON.stringify(this.helperService.isLoggedIn.value.wallet)).wiPubKeyHash.getPubKeyHash;
    this.getAllOrders(wallet_pkh)
  }

}
