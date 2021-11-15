import { IShipBid } from '../model/shipBid.d';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShipBidService {
  public bid_url = environment.db_url + '/shipbids/';

  constructor(private apiService: ApiService) {}

  public getAll(): Observable<Array<IShipBid>> {
    return this.apiService.get(this.bid_url);
  }

  public addNew(bid_data: IShipBid): Observable<Array<IShipBid>> {
    return this.apiService.post(this.bid_url, bid_data);
  }

  public update(id: string, bid_data: IShipBid): Observable<Array<IShipBid>> {
    return this.apiService.put(this.bid_url + id, bid_data);
  }
  public updateStatus(id: string, bid_data: any): Observable<Array<IShipBid>> {
    return this.apiService.patch(this.bid_url + id, bid_data);
  }

  public single(id: string): Observable<IShipBid> {
    return this.apiService.get(this.bid_url + id);
  }

  public delete(id: string): Observable<any> {
    return this.apiService.delete(this.bid_url + id);
  }
}
