import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from '../admin.component';
import { UserCrudComponent } from '../components/user-crud/user-crud.component';

const routes: Routes = [
  { path: 'dashboard', component: AdminComponent },
  { path: 'users', component: UserCrudComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
