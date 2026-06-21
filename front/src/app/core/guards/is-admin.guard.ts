import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { ToastService } from '../services/toast.service';

export const isAdminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  const user = authService.currentUser();

  if (user?.role === 'admin') {
    return true;
  }

  toastService.showError('No tenés permiso para acceder a esta sección.');
  router.navigate(['/publicaciones']);
  return false;
};
