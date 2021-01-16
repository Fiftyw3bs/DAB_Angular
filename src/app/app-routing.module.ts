import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { UserCrudComponent } from './admin/user-crud/user-crud.component';
import { AuthGuard } from './auth.guard';
import { SigninSignupComponent } from './components/signin-signup/signin-signup.component';
import { PageNotFoundErrorComponent } from './layouts/page-not-found-error/page-not-found-error.component';

const routes: Routes = [
  { path: "", redirectTo: "admin-dashboard", pathMatch: "full" },
  {
    path: "", canActivate: [AuthGuard], children: [
      { path: "admin-dashboard", component: AdminDashboardComponent },
      { path: "admin/user", component: UserCrudComponent },
    ]
  },
  { path: "sign-in", component: SigninSignupComponent },
  { path: "sign-up", component: SigninSignupComponent },

  { path: "**", component: PageNotFoundErrorComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
