import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from './../../services/helper.service';
import * as $ from 'jquery'

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
      this.logged_in = !!res;
    });
  }

  ngOnInit(): void {
    $(function(){
      $(".btn-toggle-menu").click(function() {
          $("#wrapper").toggleClass("toggled");
      });
    })
  }

  ngDoCheck() {
    const user_session = sessionStorage.getItem('user_session');
    if (user_session) {
      this.logged_in = true;
      this.helperService.isLoggedIn.next(JSON.parse(user_session));
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
    this.helperService.isLoggedIn.next(undefined);
    this.router.navigate(['/login']);
  }
}
