import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IProduct } from './models/product';
import { AdminService } from './services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  public total_user: number = 0;
  public total_product: number = 0;

  constructor(private router: Router, private adminService: AdminService) {}

  ngOnInit() {
    this.adminUserDashboardData();
    this.getAllProduct();
  }

  public userDashboard() {
    this.router.navigateByUrl('/admin/users');
  }

  public productDashboard() {
    this.router.navigateByUrl('/admin/products');
  }

  private adminUserDashboardData() {
    this.adminService.allUser().subscribe(
      (data) => {
        this.total_user = data.length;
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }

  private getAllProduct() {
    this.adminService.getAdminallProduct().subscribe(
      (data: Array<IProduct>) => {
        this.total_product = data.length;
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }
}
