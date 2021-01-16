import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from "./../../services/helper.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  logged_in: Boolean = false;
  language: String = 'English';
  user_role: String;

  constructor(private router: Router, private helperService: HelperService) {
    this.helperService.isLoggedIn.subscribe((res) => {
      this.logged_in = res;
    })
  }
  ngOnInit() {
  }

  ngDoCheck() {
    this.user_role = sessionStorage.getItem("role");

    const user_session_id = sessionStorage.getItem("user_session_id")
    if (user_session_id) {
      this.logged_in = true;
    }
  }

  logOut() {
    sessionStorage.removeItem("user_session_id");
    this.helperService.isLoggedIn.next(false);
    this.router.navigateByUrl('/sign-in');
  }

}
