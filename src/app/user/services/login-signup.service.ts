import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class LoginSignupService {
  public login_url = environment.server_url;
  public reg_url = environment.server_url;

  constructor(private http: HttpClient, private apiService: ApiService) { }

  authLogin(user_name, password): Observable<any> {
    return this.apiService.get(`${this.login_url}/user?email=${user_name}&password=${password}`);
  }
  userRegister(user_dto): Observable<any> {
    return this.apiService.post(this.reg_url + '/user', user_dto);
  }

}
