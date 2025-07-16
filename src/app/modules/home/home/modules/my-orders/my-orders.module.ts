import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyOrdersComponent } from './my-orders.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

const routes = [
  { 
    path: '', component: MyOrdersComponent, 
    // canActivate: [AuthGuard]
    
  }
]

@NgModule({
  declarations: [MyOrdersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ]
})
export class MyOrdersModule { }
