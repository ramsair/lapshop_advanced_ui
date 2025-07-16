import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupportComponent } from './support/support.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes = [
  { 
    path: '', component: HomeComponent, 
    canActivate: [AuthGuard]
    
  },
  { path: 'laptops', loadChildren: () => import('./modules/products/products.module').then(m => m.ProductsModule), canActivate: [AuthGuard] },
  { 
    path: 'deals', loadChildren: () => import('./modules/deals/deals.module').then(m => m.DealsModule), 
    canActivate: [AuthGuard]
  },
  { 
    path: 'cart', loadChildren: () => import('./modules/cart/cart.module').then(m => m.CartModule), 
    canActivate: [AuthGuard]

  },
  { 
    path: 'details', loadChildren: () => import('./modules/details/details.module').then(m => m.DetailsModule), 
    canActivate: [AuthGuard]

  },
  { 
    path: 'orders', loadChildren: () => import('./modules/my-orders/my-orders.module').then(m => m.MyOrdersModule), 
    canActivate: [AuthGuard]

  },
  { 
    path: 'settlement', loadChildren: () => import('./modules/settlement/settlement.module').then(m => m.SettlementModule), 
    canActivate: [AuthGuard]

  },
  {
    path: 'support', component: SupportComponent,
    canActivate: [AuthGuard]

  }
]

@NgModule({
  declarations: [
    HomeComponent,
    SupportComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
  ]
})
export class HomeModule { }
