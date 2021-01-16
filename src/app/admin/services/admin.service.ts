import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public user_url = environment.server_url + "/user/";
  public product_url = environment.server_url + "/products/";

  public all_user = environment.server_url + "/user";

  constructor(private apiService: ApiService) { }


  authLogin(user_name, password): Observable<any> {
    return this.apiService.get(`${environment.server_url}/user?email=${user_name}&password=${password}`);
  }


  userDashboardData() {
    return this.apiService.get(this.user_url);
  }
  productDashboardData() {
    return this.apiService.get(this.product_url);
  }
  allUser(): Observable<any> {
    return this.apiService.get(this.all_user);
  }

  addUser(user_dto): Observable<any> {
    return this.apiService.post(this.user_url, user_dto);
  }

  //get data of individual user
  singleUser(user_id) {
    return this.apiService.get(this.user_url + user_id);
  }
  //update data of individual user
  editUser(user_id, user_dto): Observable<any> {
    return this.apiService.put(this.user_url + user_id, user_dto);
  }
  //Delete individual user
  deleteUser(user_id) {
    return this.apiService.delete(this.user_url + user_id);
  }
}
