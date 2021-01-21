import { IBid } from './../model/bid.d';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BidsService {
  public bid_url = environment.server_url + '/bids/';

  constructor(private apiService: ApiService) {}

  public getAllBids(): Observable<Array<IBid>> {
    return this.apiService.get(this.bid_url);
  }

  public addNewBid(bid_data: IBid): Observable<Array<IBid>> {
    return this.apiService.post(this.bid_url, bid_data);
  }

  public updateBid(id: string, bid_data: IBid): Observable<Array<IBid>> {
    return this.apiService.put(this.bid_url + id, bid_data);
  }
  public updateBidStatus(id: string, bid_data: any): Observable<Array<IBid>> {
    return this.apiService.patch(this.bid_url + id, bid_data);
  }

  public singleBid(id: string): Observable<IBid> {
    return this.apiService.get(this.bid_url + id);
  }

  public deleteBid(id: string): Observable<any> {
    return this.apiService.delete(this.bid_url + id);
  }
}
