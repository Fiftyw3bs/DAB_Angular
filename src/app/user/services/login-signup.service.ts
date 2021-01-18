import { IUser } from 'src/app/user/model/user';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root',
})
export class LoginSignupService {
  private login_url = environment.server_url;
  private reg_url = environment.server_url;

  constructor(private http: HttpClient, private apiService: ApiService) {}

  public authLogin(
    user_name: string,
    password: string
  ): Observable<Array<IUser>> {
    return this.apiService.post(`${this.login_url}/login`, {
      email: user_name,
      password: password,
    });
  }

  public getUser(id: string): Observable<IUser> {
    return this.apiService.get(`${this.login_url}/user/${id}`);
  }

  public userRegister(user_dto: IUser): Observable<Array<IUser>> {
    return this.apiService.post(this.reg_url + '/user', user_dto);
  }

  public updateUser(id: string, user_dto: IUser): Observable<Array<IUser>> {
    return this.apiService.patch(this.reg_url + '/user/' + id, user_dto);
  }
}
