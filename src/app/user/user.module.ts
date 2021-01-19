import { NgModule } from '@angular/core';

import { UserRoutingModule } from './routing/user-routing.module';
import { UserComponent } from './user.component';
import { SigninSignupComponent } from './components/signin-signup/signin-signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ProductsComponent } from './components/products/products.component';

@NgModule({
  declarations: [
    UserComponent,
    SigninSignupComponent,
    UserDashboardComponent,
    UserProfileComponent,
    ProductsComponent,
  ],
  imports: [UserRoutingModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class UserModule {}