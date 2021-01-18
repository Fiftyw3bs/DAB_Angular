import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from '../../models/product';
import { AdminService } from '../../services/admin.service';
declare var jQuery: any;

@Component({
  selector: 'app-product-crud',
  templateUrl: './product-crud.component.html',
  styleUrls: ['./product-crud.component.scss'],
})
export class ProductCrudComponent implements OnInit {
  public all_product_data: Array<IProduct>;
  public addEditProductForm: FormGroup;
  public isFormSubmitted: boolean; //for form validation
  public popup_header: string;
  public add_product: boolean;
  public edit_product: boolean;
  public uploadedImage: any;
  public uploadedImageName: any;
  private single_product_data: IProduct;
  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  public changePhoto(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (e) => {
        this.uploadedImage = e.target.result;
        this.uploadedImageName = event.target.files[0].name;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  ngOnInit() {
    this.addEditProductForm = this.formBuilder.group({
      name: ['', Validators.required],
      uploadPhoto: [''],
      description: ['', Validators.required],
      cost: ['', Validators.required],
      total_number_sold: ['', Validators.required],
    });
    this.getAllProduct();
  }

  get rf() {
    return this.addEditProductForm.controls;
  }

  private getAllProduct() {
    this.adminService.getAdminallProduct().subscribe(
      (data: Array<IProduct>) => {
        this.all_product_data = data;
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }
  public addProductPopup() {
    this.add_product = true;
    this.uploadedImage = undefined;
    this.uploadedImageName = undefined;
    this.edit_product = false;
    this.popup_header = 'Add New Product';
    this.addEditProductForm.reset();
  }

  public addNewProduct() {
    this.isFormSubmitted = true;
    if (this.addEditProductForm.invalid) {
      return;
    }
    const value = this.addEditProductForm.value;
    const reqData = {
      name: value.name,
      uploadPhoto: this.uploadedImage,
      uploadPhotoName: this.uploadedImageName,
      description: value.description,
      cost: value.cost,
      total_number_sold: value.total_number_sold,
    };
    this.adminService.addNewProduct(reqData).subscribe(
      (data) => {
        this.uploadedImage = undefined;
        this.uploadedImageName = undefined;
        jQuery('#addEditProductModal').modal('toggle');
        this.getAllProduct();
      },
      (err) => {
        this.toastr.error('Some Error Occured!', 'FAILED!');
      }
    );
  }

  public editProductPopup(id: string) {
    this.add_product = false;
    this.edit_product = true;
    this.popup_header = 'Edit Product';
    this.addEditProductForm.reset();
    this.adminService.singleProduct(id).subscribe((data: IProduct) => {
      this.single_product_data = data;
      this.uploadedImage = data.uploadPhoto;
      this.addEditProductForm.setValue({
        name: this.single_product_data.name,
        uploadPhoto: '',
        description: this.single_product_data.description,
        cost: this.single_product_data.cost,
        total_number_sold: this.single_product_data.total_number_sold,
      });
    });
  }

  public updateProduct() {
    this.isFormSubmitted = true;
    if (this.addEditProductForm.invalid) {
      return;
    }
    const value = this.addEditProductForm.value;
    const reqData = {
      name: value.name,
      uploadPhoto: this.uploadedImage,
      uploadPhotoName: this.uploadedImageName,
      description: value.description,
      cost: value.cost,
      total_number_sold: value.total_number_sold,
    };
    this.adminService
      .updateProduct(this.single_product_data.id, reqData)
      .subscribe(
        (data: Array<IProduct>) => {
          this.uploadedImage = undefined;
          this.uploadedImageName = undefined;
          this.single_product_data = undefined;
          jQuery('#addEditProductModal').modal('toggle');
          this.getAllProduct();
        },
        (err) => {
          this.toastr.error('Some Error Occured!', 'FAILED!');
        }
      );
  }

  public deleteProduct(id: string) {
    let r = confirm('Do you want to delete the product ID: ' + id + '?');
    if (r === true) {
      this.adminService.deleteProduct(id).subscribe(
        (data) => {
          console.log('deleted successfully', data);
          this.getAllProduct();
        },
        (err) => {
          this.toastr.error('Some Error Occured!', 'FAILED!');
        }
      );
    } else {
    }
  }
}
