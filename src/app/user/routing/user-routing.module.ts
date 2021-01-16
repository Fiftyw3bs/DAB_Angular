import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninSignupComponent } from '../components/signin-signup/signin-signup.component';

// import { UserComponent } from './user.component';

const routes: Routes = [
  { path: 'login', component: SigninSignupComponent },
  { path: 'signup', component: SigninSignupComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
