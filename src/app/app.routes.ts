import { Routes } from '@angular/router';
// import { AuthService } from './services/auth.service';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
    // canActivate: [AuthService],
  },
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/auth.page').then((m) => m.AuthPage),
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];
