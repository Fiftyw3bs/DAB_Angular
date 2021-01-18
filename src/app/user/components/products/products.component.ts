import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IProduct } from 'src/app/admin/models/product';
import { AdminService } from 'src/app/admin/services/admin.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  public all_product_data: Array<IProduct>;

  constructor(private router: Router, private product_service: AdminService) {}
  ngOnInit() {
    this.getAllProduct();
  }

  private getAllProduct() {
    this.product_service.getAdminallProduct().subscribe(
      (data: Array<IProduct>) => {
        this.all_product_data = data;
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }
}
