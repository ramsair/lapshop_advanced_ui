import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { RouterModule } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes = [
  { 
    path: 'dashboard', component: AdminComponent, 
    canActivate: [AuthGuard]
  },
  {
    path: 'products', component: ProductsComponent,
    canActivate: [AuthGuard]
  }
]

@NgModule({
  declarations: [
    AdminComponent,
    ProductsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AdminModule { }