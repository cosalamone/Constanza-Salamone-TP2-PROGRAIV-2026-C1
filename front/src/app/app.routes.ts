import { Routes } from '@angular/router';
import { isLoggedInGuard } from './core/guards/is-logged-in-guard';
import { isAdminGuard } from './core/guards/is-admin.guard';

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
    canActivate: [isLoggedInGuard],
    loadComponent: () => import('./pages/my-profile/my-profile').then((m) => m.MyProfile),
  },
  {
    path: 'publicaciones',
    loadComponent: () => import('./pages/publications/publications').then((m) => m.Publications),
  },
  {
    path: 'publicaciones/:id',
    loadComponent: () => import('./pages/publication-detail/publication-detail').then((m) => m.PublicationDetail),
  },
  {
    path: 'admin/usuarios',
    canActivate: [isLoggedInGuard, isAdminGuard],
    loadComponent: () => import('./pages/admin/users/admin-users').then((m) => m.AdminUsers),
  },
  {
    path: 'admin/estadisticas',
    canActivate: [isLoggedInGuard, isAdminGuard],
    loadComponent: () => import('./pages/admin/statistics/admin-statistics').then((m) => m.AdminStatistics),
  },
];
