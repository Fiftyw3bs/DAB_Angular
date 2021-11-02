import { UserService } from './../../../admin/services/user.service';
import { IUser } from 'src/app/user/model/user';
import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from 'src/app/services/helper.service';
import { ContractsService } from '../../services/contract.service';
import { IWallet } from '../../model/wallet';

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
    private userService: UserService,
    private contractService: ContractsService,
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
      // addLine1: ['', Validators.required],
      // uploadPhoto: ['', Validators.required],
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
    var reqData: any;
    if (this.signUpform.invalid) {
      return;
    }
    const value = this.signUpform.value;
    this.contractService.gen_wallet("").subscribe(
      (wallet) => {
        // var w: IWallet;
        // w.id = wallet["wiWallet"]["getWalletId"];
        // w.pubkeyhash = wallet["wiPubKeyHash"]["getPubKeyHash"];
        // w.pubkey = wallet["wiPubKey"]["getPubKey"];
        reqData = {
          email: value.email,
          mobNumber: value.mobNumber,
          name: value.name,
          password: value.password,
          wallet: wallet
        };
        console.log(reqData)
        this.userService.addUser(reqData).subscribe(
          (data) => {
            this.toastr.success('User Creates successsfully!', 'SUCCESS!');
            this.router.navigate(['/login']);
          },
          (err) => {
            this.toastr.error('Some Error Occured!', 'FAILED!');
          }
        );
      },
      (err) => {
        this.toastr.error('Some Error Occured!', err);
      }
    );

  }

  public onSubmitSignIn() {
    this.signInsubmitted = true;
    if (this.signInform.invalid) {
      return;
    }
    const value = this.signInform.value;
    this.userService.authLogin(value.email, value.password).subscribe(
      (data: Array<IUser>) => {
        if (data && data.length !== 0) {
          const user = data[0];
          sessionStorage.setItem('user_session', JSON.stringify(user));
          this.toastr.success('Login!', 'SUCCESS!');
          if (user.admin) {
            this.router.navigate(['/admin/dashboard']);
            sessionStorage.setItem('admin', 'true');
          }
          if (!user.admin) {
            this.router.navigate(['/profile']);
          }
          this.helperService.isLoggedIn.next(user);
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
