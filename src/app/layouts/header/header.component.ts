import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from './../../services/helper.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public logged_in: boolean;
  public isUser: boolean;

  constructor(private router: Router, private helperService: HelperService) {
    this.helperService.isLoggedIn.subscribe((res) => {
      this.logged_in = res;
    });
  }

  ngDoCheck() {
    const user_session_id = sessionStorage.getItem('user_session_id');
    if (user_session_id) {
      this.logged_in = true;
    } else {
      this.logged_in = false;
    }
    if (!sessionStorage.getItem('admin')) {
      this.isUser = true;
    } else {
      this.isUser = false;
    }
  }

  public logOut() {
    sessionStorage.clear();
    this.helperService.isLoggedIn.next(false);
    this.router.navigate(['/login']);
  }
}
