import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './routing/user-routing.module';
import { UserComponent } from './user.component';
import { SigninSignupComponent } from './components/signin-signup/signin-signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UserComponent, SigninSignupComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class UserModule {}
