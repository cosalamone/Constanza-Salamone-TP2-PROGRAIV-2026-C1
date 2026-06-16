import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'publicaciones',
  },
  {
    path: 'home',
    redirectTo: 'publicaciones',
  },
  {
    path: 'inicio',
    redirectTo: 'publicaciones',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },
  {
    path: 'mi-perfil',
    loadComponent: () => import('./pages/my-profile/my-profile').then((m) => m.MyProfile), 
  },
  {
    path: 'publicaciones',
    loadComponent: () => import('./pages/publications/publications').then((m) => m.Publications), 
  }
];
