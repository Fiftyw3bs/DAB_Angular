import { UserService } from './services/user.service';
import { ProductService } from './services/product.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IProduct } from './models/product';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  public total_user: number = 0;
  public total_product: number = 0;

  constructor(
    private router: Router,
    private productService: ProductService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.adminUserDashboardData();
    this.getAllProduct();
  }

  public userDashboard() {
    this.router.navigate(['/admin/users']);
  }

  public productDashboard() {
    this.router.navigate(['/admin/products']);
  }

  private adminUserDashboardData() {
    this.userService.allUser().subscribe(
      (data) => {
        this.total_user = data.length;
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }

  private getAllProduct() {
    this.productService.getAllProducts().subscribe(
      (data: Array<IProduct>) => {
        this.total_product = data.length;
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }
}
