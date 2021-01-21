import { UserProfileComponent } from './../components/user-profile/user-profile.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninSignupComponent } from '../components/signin-signup/signin-signup.component';
import { UserGuard } from 'src/app/user.guard';
import { ProductsComponent } from '../components/products/products.component';
import { OrdersComponent } from '../components/orders/orders.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [UserGuard],
    children: [
      // { path: 'dashboard', component: UserDashboardComponent },
      { path: 'profile', component: UserProfileComponent },
      { path: 'market', component: OrdersComponent },
    ],
  },
  { path: 'login', component: SigninSignupComponent },
  { path: 'signup', component: SigninSignupComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
