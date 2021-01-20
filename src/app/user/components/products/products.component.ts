import { ProductService } from './../../../admin/services/product.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IProduct } from 'src/app/admin/models/product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  public all_product_data: Array<IProduct>;

  constructor(
    private router: Router,
    private product_service: ProductService
  ) {}
  ngOnInit() {
    this.getAllProduct();
  }

  private getAllProduct() {
    this.product_service.getAllProducts().subscribe(
      (data: Array<IProduct>) => {
        this.all_product_data = data;
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }
}
