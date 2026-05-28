import { Routes } from '@angular/router';
import { isLoggedInGuard } from './core/guards/is-logged-in-guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'inicio',
    redirectTo: 'home',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/login/register/register').then((m) => m.Register),
  },
  {
    path: 'mi-perfil',
    loadComponent: () => import('./pages/my-profile/my-profile').then((m) => m.MyProfile), 
    canActivate: [isLoggedInGuard],
  },
  {
    path: 'publicaciones',
    loadComponent: () => import('./pages/publications/publications').then((m) => m.Publications), 
    canActivate: [isLoggedInGuard], // TODO: ver el otro guard que habia faltado antes
  }
];
