import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
declare var jQuery: any;

@Component({
  selector: 'app-user-crud',
  templateUrl: './user-crud.component.html',
  styleUrls: ['./user-crud.component.scss']
})
export class UserCrudComponent implements OnInit {

  all_user_data;
  single_user_data;
  addEditUserForm: FormGroup;
  user_dto: any;
  user_reg_data;
  edit_user_id;
  upload_file_name: string;

  addEditUser = false;//for form validation

  add_user: Boolean = false;
  edit_user: Boolean = false;
  popup_header: string;

  signInFormValue: any = {};

  constructor(private formBuilder: FormBuilder, private router: Router, private admin_service: AdminService) { }

  ngOnInit() {
    this.getAllUser();
    this.addEditUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      mobNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      addLine1: ['', Validators.required],
      uploadPhoto: [],
    })
  }

  getAllUser() {
    this.admin_service.allUser().subscribe(data => {
      this.all_user_data = data;
    }, error => {
      console.log("My error", error);
    })
  }
  get rf() { return this.addEditUserForm.controls; }

  //popup when add
  addUserPopup() {
    this.edit_user = false;
    this.add_user = true;
    this.popup_header = "Add New User";
    this.addEditUserForm.reset();
  }
  addUser() {
    this.addEditUser = true;
    if (this.addEditUserForm.invalid) {
      alert('Error!! :-)\n\n' + JSON.stringify(this.addEditUserForm.value))
      return;
    }
    this.user_reg_data = this.addEditUserForm.value;
    this.user_dto = {
      name: this.user_reg_data.name,
      mobNumber: this.user_reg_data.mobNumber,
      email: this.user_reg_data.email,
      password: this.user_reg_data.password,
      address: {
        id: 0,
        addLine1: this.user_reg_data.addLine1,
        addLine2: this.user_reg_data.addLine2,
        city: this.user_reg_data.city,
        state: this.user_reg_data.state,
        zipCode: this.user_reg_data.zipCode,
      },
      uploadPhoto: this.user_reg_data.uploadPhoto,
    }
    this.admin_service.addUser(this.user_dto).subscribe(data => {
      this.getAllUser();
      jQuery('#addEditUserModal').modal('toggle');
    }, err => {
      alert("Some Error Occured");
    })
  }

  // popup when edit
  editUserPopup(user_id) {
    this.edit_user_id = user_id;
    this.edit_user = true;
    this.add_user = false;
    this.popup_header = "Edit User";
    this.admin_service.singleUser(user_id).subscribe(data => {
      this.single_user_data = data;
      this.upload_file_name = this.single_user_data.uploadPhoto;
      this.addEditUserForm.setValue({
        name: this.single_user_data.name,
        mobNumber: this.single_user_data.mobNumber,
        email: this.single_user_data.email,
        password: this.single_user_data.password,
        addLine1: this.single_user_data.address.addLine1,
        uploadPhoto: '',
      })
    }, error => {
      console.log("My error", error);
    })
  }
  updateUser() {
    if (this.addEditUserForm.invalid) {
      return;
    }
    this.user_reg_data = this.addEditUserForm.value;
    this.user_dto = {
      name: this.user_reg_data.name,
      mobNumber: this.user_reg_data.mobNumber,
      email: this.user_reg_data.email,
      password: this.user_reg_data.password,
      address: {
        id: 0,
        addLine1: this.user_reg_data.addLine1,
        addLine2: this.user_reg_data.addLine2,
        city: this.user_reg_data.city,
        state: this.user_reg_data.state,
        zipCode: this.user_reg_data.zipCode,
      },
      uploadPhoto: (this.user_reg_data.uploadPhoto == "" ? this.upload_file_name : this.user_reg_data.uploadPhoto),
    }
    this.admin_service.editUser(this.edit_user_id, this.user_dto).subscribe(data => {
      this.getAllUser();
      jQuery('#addEditUserModal').modal('toggle');
    }, err => {
      alert("Some Error Occured");
    })
  }
  deleteUser(user_id) {
    this.admin_service.deleteUser(user_id).subscribe(data => {
      this.getAllUser();
    }, err => {
      alert("Some Error Occured");
    })
  }

}
