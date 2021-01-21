import { IUser } from './../user/model/user.d';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  public isLoggedIn: BehaviorSubject<IUser> = new BehaviorSubject(undefined);

  constructor() {}
}
