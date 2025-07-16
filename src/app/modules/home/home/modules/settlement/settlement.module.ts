import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SettlementComponent } from './settlement.component';

const routes = [
  { 
    path: '', component: SettlementComponent, 
    // canActivate: [AuthGuard]
    
  }
]

@NgModule({
  declarations: [SettlementComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
  ]
})
export class SettlementModule { }
