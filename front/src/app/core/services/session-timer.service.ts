import { Injectable, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from '../../services/auth/auth.service';
import { NavigateToService } from './navigate/navigate-to.service';

@Injectable({ providedIn: 'root' })
export class SessionTimerService {
  private _confirmationService = inject(ConfirmationService);
  private _authService = inject(AuthService);
  private _navigateTo = inject(NavigateToService);

  readonly showTimer = signal(false);
  readonly isRunning = signal(false);

  private _resetCounter = signal(0);

  get resetSignal() {
    return this._resetCounter;
  }

  startTimer(): void {
    this.showTimer.set(true);
    this.isRunning.set(true);
    this._resetCounter.update((v) => v + 1);
  }

  stopTimer(): void {
    this.isRunning.set(false);
    this.showTimer.set(false);
  }

  onTimerFinished(): void {
    this.isRunning.set(false);

    this._confirmationService.confirm({
      message: 'Tu sesión expira en 5 minutos. ¿Deseas extenderla?',
      header: 'Sesión por expirar',
      acceptLabel: 'Extender',
      rejectLabel: 'Cerrar sesión',
      acceptButtonStyleClass: 'p-button-success',
      accept: () => {
        this._confirmationService.close();
        this._authService.refreshToken().subscribe({
          next: () => {
            this.startTimer();
          },
          error: () => {
            this._handleLogout();
          },
        });
      },
      reject: () => {
        this._confirmationService.close();
        this._handleLogout();
      },
    });
  }

  private _handleLogout(): void {
    this.stopTimer();
    this._authService.logout();
    this._navigateTo.navigateToLogin();
  }
}
