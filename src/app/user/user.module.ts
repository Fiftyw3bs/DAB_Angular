import { NgModule } from '@angular/core';

import { UserRoutingModule } from './routing/user-routing.module';
import { UserComponent } from './user.component';
import { SigninSignupComponent } from './components/signin-signup/signin-signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [UserComponent, SigninSignupComponent],
  imports: [UserRoutingModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class UserModule {}
