import { IOrder } from './../model/order.d';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  public order_url = environment.server_url + '/orders/';

  constructor(private apiService: ApiService) {}

  public getAllOrders(): Observable<Array<IOrder>> {
    return this.apiService.get(this.order_url);
  }

  public addNewOrder(product_dto: IOrder): Observable<Array<IOrder>> {
    return this.apiService.post(this.order_url, product_dto);
  }

  public updateOrderBid(id: string, bid_data: any): Observable<Array<IOrder>> {
    return this.apiService.patch(this.order_url + id, bid_data);
  }

  public updateOrder(
    id: string,
    product_dto: IOrder
  ): Observable<Array<IOrder>> {
    return this.apiService.put(this.order_url + id, product_dto);
  }

  public singleOrder(id: string): Observable<IOrder> {
    return this.apiService.get(this.order_url + id);
  }

  public deleteOrder(id: string): Observable<any> {
    return this.apiService.delete(this.order_url + id);
  }
}
