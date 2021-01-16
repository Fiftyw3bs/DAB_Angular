import { IUser } from 'src/app/user/model/user';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from 'src/app/services/helper.service';
import { LoginSignupService } from '../../services/login-signup.service';

@Component({
  selector: 'app-signin-signup',
  templateUrl: './signin-signup.component.html',
  styleUrls: ['./signin-signup.component.scss'],
})
export class SigninSignupComponent implements OnInit {
  public regForm: boolean = false;
  public signUpform: FormGroup;
  public signInform: FormGroup;
  public signUpsubmitted = false;
  public signInsubmitted = false;

  constructor(
    private helperService: HelperService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
    private logsign_service: LoginSignupService
  ) {}

  ngOnInit() {
    if (this.router.url === '/signup') {
      this.regForm = true;
    } else if (this.router.url === '/login') {
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
    this.signInform = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get rf() {
    return this.signUpform.controls;
  }

  public onSubmitSignUp() {
    this.signUpsubmitted = true;
    if (this.signUpform.invalid) {
      return;
    }
    const value = this.signUpform.value;
    const reqData = {
      email: value.email,
      address: {
        id: 0,
        addLine1: value.addLine1,
      },
      mobNumber: value.mobNumber,
      name: value.name,
      password: value.password,
      uploadPhoto: value.uploadPhoto,
    };
    this.logsign_service.userRegister(reqData).subscribe(
      (data) => {
        this.toastr.success('User Creates successsfully!', 'SUCCESS!');
        this.router.navigateByUrl('/login');
      },
      (err) => {
        this.toastr.error('Some Error Occured!', 'FAILED!');
      }
    );
  }

  public onSubmitSignIn() {
    this.signInsubmitted = true;
    if (this.signInform.invalid) {
      return;
    }
    const value = this.signInform.value;
    this.logsign_service.authLogin(value.email, value.password).subscribe(
      (data: Array<IUser>) => {
        if (data && data.length !== 0) {
          const user = data[0];
          sessionStorage.setItem('user_session_id', user.id);
          this.toastr.success('Login!', 'SUCCESS!');
          if (user.admin) {
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
