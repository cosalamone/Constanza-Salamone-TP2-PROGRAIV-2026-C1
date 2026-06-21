import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { ToastComponent } from './core/components/toast/toast.component';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { AuthService } from './services/auth/auth.service';
import { SessionTimerService } from './core/services/session-timer.service';
import { SpinnerComponent } from './core/components/spinner/spinner';
import { forkJoin, timer } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ToastComponent, ConfirmDialog, SpinnerComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  private readonly _authService = inject(AuthService);
  private readonly _sessionTimer = inject(SessionTimerService);
  private readonly _router = inject(Router);

  protected readonly sidebarCollapsed = signal(false);
  protected readonly loading = signal(true);

  public ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.sidebarCollapsed.set(window.innerWidth <= 768);
    }

    if (this._authService.getToken()) {
      forkJoin({
        auth: this._authService.authorize(),
        delay: timer(2000),
      }).subscribe({
        next: () => {
          this._sessionTimer.startTimer();
          this.loading.set(false);
        },
        error: () => {
          this._authService.logout();
          this.loading.set(false);
          this._router.navigate(['/login']);
        },
      });
    } else {
      timer(2000).subscribe(() => {
        this.loading.set(false);
        this._router.navigate(['/login']);
      });
    }
  }
}
