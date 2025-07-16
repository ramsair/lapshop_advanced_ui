import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path:'home',
    loadChildren: () => import('./modules/home/home/home.module').then((m:any) => m.HomeModule),
    canActivate: [AuthGuard]
  },
  {
    path:'admin',
    loadChildren: () => import('./modules/admin/admin.module').then((m:any) => m.AdminModule),
    canActivate: [AuthGuard]
  },
  {
    path:'login',
    component: LoginComponent,
  },
// {
//   path: 'login',
//   loadChildren: () => import('./components/login/login.component').then(m => m.LoginComponent)
// },

  {
    path:'register',
    component: RegisterUserComponent,
  },

//   {
//   path: 'register',
//   loadComponent: () => import('./components/register-user/register-user.component')
//     .then(c => c.RegisterUserComponent)
// },

  { path: '**', redirectTo: 'login', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
