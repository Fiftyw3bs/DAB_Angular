import { NgModule } from '@angular/core';

import { UserRoutingModule } from './routing/user-routing.module';
import { UserComponent } from './user.component';
import { SigninSignupComponent } from './components/signin-signup/signin-signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ProductsComponent } from './components/products/products.component';
import { OrdersComponent } from './components/orders/orders.component';

@NgModule({
  declarations: [
    UserComponent,
    SigninSignupComponent,
    UserProfileComponent,
    ProductsComponent,
    OrdersComponent,
  ],
  imports: [UserRoutingModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class UserModule {}
