import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { ToastService } from '../services/toast.service';

export const isLoggedInGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  const currentUser = authService.currentUser();

  if (currentUser) {
    return true;
  }

  toastService.showError('Para poder ingresar a esa sección debés iniciar sesión.');
  router.navigate(['/login']);
  return false;
};
