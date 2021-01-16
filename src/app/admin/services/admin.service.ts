import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { IUser } from 'src/app/user/model/user';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private user_url = environment.server_url + '/user/';
  private all_user = environment.server_url + '/user';

  constructor(private apiService: ApiService) {}

  public authLogin(
    user_name: string,
    password: string
  ): Observable<Array<IUser>> {
    return this.apiService.post(`${environment.server_url}/login`, {
      email: user_name,
      password,
    });
  }

  public allUser(): Observable<Array<IUser>> {
    return this.apiService.get(this.all_user);
  }

  public addUser(user_dto: IUser): Observable<IUser> {
    return this.apiService.post(this.user_url, user_dto);
  }

  //get data of individual user
  public singleUser(user_id): Observable<IUser> {
    return this.apiService.get(this.user_url + user_id);
  }

  //update data of individual user
  public editUser(user_id: number, user_dto: IUser): Observable<IUser> {
    return this.apiService.put(this.user_url + user_id, user_dto);
  }

  //Delete individual user
  public deleteUser(user_id: number) {
    return this.apiService.delete(this.user_url + user_id);
  }
}
