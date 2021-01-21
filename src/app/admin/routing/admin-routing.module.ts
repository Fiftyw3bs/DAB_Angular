import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from 'src/app/user/components/orders/orders.component';

import { AdminComponent } from '../admin.component';
import { ProductCrudComponent } from '../components/product-crud/product-crud.component';
import { UserCrudComponent } from '../components/user-crud/user-crud.component';

const routes: Routes = [
  { path: 'dashboard', component: AdminComponent },
  { path: 'users', component: UserCrudComponent },
  { path: 'products', component: ProductCrudComponent },
  { path: 'orders', component: OrdersComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
