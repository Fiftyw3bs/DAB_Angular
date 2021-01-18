import { IUser } from './../../model/user.d';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from 'src/app/services/helper.service';
import { LoginSignupService } from '../../services/login-signup.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  public formSubmmited = false;
  public formGroup = this.formBuilder.group({
    name: ['', Validators.required],
    mobNumber: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    addLine1: ['', Validators.required],
    uploadPhoto: [''],
  });
  public uploadedImage: any;

  private user: IUser;
  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private logsign_service: LoginSignupService
  ) {}

  ngOnInit(): void {
    const id = sessionStorage.getItem('user_session_id');
    this.logsign_service.getUser(id).subscribe((res: IUser) => {
      if (res) {
        setTimeout(() => {
          this.uploadedImage = res.uploadPhoto;
          this.user = res;
          this.formGroup.setValue({
            name: this.user.name,
            mobNumber: this.user.mobNumber,
            email: this.user.email,
            addLine1: this.user.address.addLine1,
            uploadPhoto: '',
          });
          this.formGroup.get('email').disable();
        }, 500);
      }
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

  public onSubmit() {
    this.formSubmmited = true;
    if (this.formGroup.invalid) {
      return;
    }
    const value = this.formGroup.value;
    const reqData = {
      email: value.email,
      address: {
        id: 0,
        addLine1: value.addLine1,
      },
      mobNumber: value.mobNumber,
      name: value.name,
      uploadPhoto: this.uploadedImage,
    };
    this.logsign_service.updateUser(this.user.id, reqData).subscribe(
      (data) => {
        this.toastr.success('User Updated successsfully!', 'SUCCESS!');
      },
      (err) => {
        this.toastr.error('Some Error Occured!', 'FAILED!');
      }
    );
  }

  get rf() {
    return this.formGroup.controls;
  }
}
