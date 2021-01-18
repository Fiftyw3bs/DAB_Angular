import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './routing/admin-routing.module';
import { AdminComponent } from './admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserCrudComponent } from './components/user-crud/user-crud.component';
import { ProductCrudComponent } from './components/product-crud/product-crud.component';

@NgModule({
  declarations: [AdminComponent, UserCrudComponent, ProductCrudComponent],
  imports: [CommonModule, AdminRoutingModule, FormsModule, ReactiveFormsModule],
})
export class AdminModule {}
