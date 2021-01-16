import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from './../../services/helper.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public logged_in: Boolean = false;
  public user_role: String;

  constructor(private router: Router, private helperService: HelperService) {
    this.helperService.isLoggedIn.subscribe((res) => {
      this.logged_in = res;
    });
  }

  ngDoCheck() {
    this.user_role = sessionStorage.getItem('role');
    const user_session_id = sessionStorage.getItem('user_session_id');
    if (user_session_id) {
      this.logged_in = true;
    }
  }

  public logOut() {
    sessionStorage.clear();
    this.helperService.isLoggedIn.next(false);
    this.router.navigateByUrl('/login');
  }
}
