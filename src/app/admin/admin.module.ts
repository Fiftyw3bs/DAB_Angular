import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserCrudComponent } from './user-crud/user-crud.component';

@NgModule({
  declarations: [AdminDashboardComponent, UserCrudComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
