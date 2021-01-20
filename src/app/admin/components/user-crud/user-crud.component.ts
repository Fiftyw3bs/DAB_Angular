import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IUser } from 'src/app/user/model/user';
declare var jQuery: any;

@Component({
  selector: 'app-user-crud',
  templateUrl: './user-crud.component.html',
  styleUrls: ['./user-crud.component.scss'],
})
export class UserCrudComponent implements OnInit {
  public all_user_data: Array<IUser>;
  private single_user_data: IUser;
  public addEditUserForm: FormGroup;
  private user_dto: IUser;
  private edit_user_id: string;
  public addEditUser = false;
  public add_user: Boolean = false;
  public edit_user: Boolean = false;
  public popup_header: string;
  public uploadedImage: any;

  constructor(
    private formBuilder: FormBuilder,
    private user_service: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getAllUser();
    this.addEditUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      mobNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      addLine1: [''],
      uploadPhoto: [],
    });
  }

  public changePhoto(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (e) => {
        console.log('-----', e.target.result);
        this.uploadedImage = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  private getAllUser() {
    this.user_service.allUser().subscribe(
      (data: Array<IUser>) => {
        this.all_user_data = data;
      },
      (error) => {
        console.log('My error', error);
      }
    );
  }
  get rf() {
    return this.addEditUserForm.controls;
  }

  //popup when add
  public addUserPopup() {
    this.edit_user = false;
    this.add_user = true;
    this.popup_header = 'Add New User';
    this.addEditUserForm.reset();
    this.uploadedImage = undefined;
  }

  public addUser() {
    this.addEditUser = true;
    // this.uploadedImage = undefined;
    if (this.addEditUserForm.invalid) {
      return;
    }
    const formData = this.addEditUserForm.value;
    this.user_dto = {
      name: formData.name,
      mobNumber: formData.mobNumber,
      email: formData.email,
      password: formData.password,
      address: {
        id: 0,
        addLine1: formData.addLine1,
      },
      uploadPhoto: this.uploadedImage,
    };
    this.user_service.addUser(this.user_dto).subscribe(
      (data) => {
        this.getAllUser();
        jQuery('#addEditUserModal').modal('toggle');
      },
      (err) => {
        this.toastr.error('Some Error Occured!', 'FAILED!');
      }
    );
  }

  // popup when edit
  public editUserPopup(user_id: string) {
    this.edit_user_id = user_id;
    this.edit_user = true;
    this.add_user = false;
    this.popup_header = 'Edit User';
    this.user_service.singleUser(user_id).subscribe(
      (data: IUser) => {
        this.single_user_data = data;
        this.uploadedImage = data.uploadPhoto;
        this.addEditUserForm.setValue({
          name: this.single_user_data.name,
          mobNumber: this.single_user_data.mobNumber,
          email: this.single_user_data.email,
          password: this.single_user_data.password,
          addLine1:
            (this.single_user_data.address &&
              this.single_user_data.address.addLine1) ||
            '',
          uploadPhoto: '',
        });
      },
      (error) => {}
    );
  }
  public updateUser() {
    if (this.addEditUserForm.invalid) {
      return;
    }
    const formData = this.addEditUserForm.value;
    this.user_dto = {
      name: formData.name,
      mobNumber: formData.mobNumber,
      email: formData.email,
      password: formData.password,
      address: {
        id: 0,
        addLine1: formData.addLine1,
      },
      uploadPhoto: this.uploadedImage,
    };
    this.user_service.editUser(this.edit_user_id, this.user_dto).subscribe(
      (data) => {
        this.uploadedImage = undefined;
        this.getAllUser();
        jQuery('#addEditUserModal').modal('toggle');
      },
      (err) => {
        this.toastr.error('Some Error Occured!', 'FAILED!');
      }
    );
  }
  public deleteUser(user_id: string) {
    this.user_service.deleteUser(user_id).subscribe(
      (data) => {
        this.getAllUser();
      },
      (err) => {
        this.toastr.error('Some Error Occured!', 'FAILED!');
      }
    );
  }
}
