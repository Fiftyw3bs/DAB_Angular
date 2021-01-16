import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from '../../../services/helper.service';
import { LoginSignupService } from '../../services/login-signup.service';

@Component({
  selector: 'app-signin-signup',
  templateUrl: './signin-signup.component.html',
  styleUrls: ['./signin-signup.component.scss'],
})
export class SigninSignupComponent implements OnInit {
  regForm: Boolean = false;
  signUpform: FormGroup;
  signInform: FormGroup;
  signUpsubmitted = false;
  href: String = '';
  user_data;
  user_dto: any;
  user_reg_data;

  signInFormValue: any = {};

  constructor(
    private helperService: HelperService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
    private logsign_service: LoginSignupService
  ) {}

  ngOnInit() {
    this.href = this.router.url;
    if (this.href == '/signup') {
      this.regForm = true;
    } else if (this.href == '/login') {
      this.regForm = false;
    }

    this.signUpform = this.formBuilder.group({
      name: ['', Validators.required],
      mobNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      addLine1: ['', Validators.required],
      uploadPhoto: ['', Validators.required],
    });

    this.signInform = this.formBuilder.group({});
  }

  get rf() {
    return this.signUpform.controls;
  }

  onSubmitSignUp() {
    this.signUpsubmitted = true;
    if (this.signUpform.invalid) {
      return;
    }
    this.user_reg_data = this.signUpform.value;
    this.user_dto = {
      email: this.user_reg_data.email,
      address: {
        id: 0,
        addLine1: this.user_reg_data.addLine1,
        addLine2: this.user_reg_data.addLine2,
        city: this.user_reg_data.city,
        state: this.user_reg_data.state,
        zipCode: this.user_reg_data.zipCode,
      },
      mobNumber: this.user_reg_data.mobNumber,
      name: this.user_reg_data.name,
      password: this.user_reg_data.password,
      uploadPhoto: this.user_reg_data.uploadPhoto,
    };
    this.logsign_service.userRegister(this.user_dto).subscribe(
      (data) => {
        this.toastr.success('User Creates successsfully!', 'SUCCESS!');
        this.router.navigateByUrl('/login');
      },
      (err) => {
        this.toastr.error('Some Error Occured!', 'FAILED!');
      }
    );
  }

  onSubmitSignIn() {
    this.logsign_service
      .authLogin(
        this.signInFormValue.userEmail,
        this.signInFormValue.userPassword
      )
      .subscribe(
        (data) => {
          if (data && data.length != 0) {
            this.user_data = data[0];

            sessionStorage.setItem('user_session_id', this.user_data.id);
            this.toastr.success('Login!', 'SUCCESS!');
            if (this.user_data.admin) {
              this.router.navigateByUrl('/admin/dashboard');
              sessionStorage.setItem('admin', 'true');
            }
            this.helperService.isLoggedIn.next(true);
          } else {
            this.toastr.error('Anthorized!', 'FAILED!');
          }
        },
        (error) => {
          console.log('My error', error);
        }
      );
  }
}
