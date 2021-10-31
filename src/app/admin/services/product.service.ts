import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { IProduct } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  public product_url = environment.db_url + '/products/';

  constructor(private apiService: ApiService) {}

  public getAllProducts(): Observable<Array<IProduct>> {
    return this.apiService.get(this.product_url);
  }

  public addNewProduct(product_dto: IProduct): Observable<Array<IProduct>> {
    return this.apiService.post(this.product_url, product_dto);
  }

  public updateProduct(
    id: string,
    product_dto: IProduct
  ): Observable<Array<IProduct>> {
    return this.apiService.put(this.product_url + id, product_dto);
  }

  public singleProduct(id: string): Observable<IProduct> {
    return this.apiService.get(this.product_url + id);
  }

  public deleteProduct(id: string): Observable<any> {
    return this.apiService.delete(this.product_url + id);
  }
}
