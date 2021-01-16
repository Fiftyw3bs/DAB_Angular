import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  public isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }
}
