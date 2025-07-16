import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealsComponent } from './deals.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

const routes = [
  { 
    path: '', component: DealsComponent, 
    // canActivate: [AuthGuard]
    
  }
]

@NgModule({
  declarations: [DealsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ]
})
export class DealsModule { }
