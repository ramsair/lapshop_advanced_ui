import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsComponent } from './products.component';
import { FormsModule } from '@angular/forms';

const routes = [
  { 
    path: '', component: ProductsComponent, 
    // canActivate: [AuthGuard]
    
  }
]

@NgModule({
  declarations: [
    ProductsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ]
})
export class ProductsModule { }
