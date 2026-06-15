import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { inject } from '@angular/core';
import { NavigateToService } from '../services/navigate/navigate-to.service';
import { ToastService } from '../services/toast.service';

// export const isLoggedInGuard: CanActivateFn = (route, state) => {
//   const _authService = inject(AuthService);
//   const currentUser = _authService.currentUser();
//   const _navigateToService = inject(NavigateToService);
//   const _toastService = inject(ToastService);

//   if (currentUser) {
//     return true;
//   } else {
//     _navigateToService.navigateToLogin();
//     _toastService.showError('Para poder ingresar a esa sección debes iniciar sesión.');
//     return false;
//   }
// };
