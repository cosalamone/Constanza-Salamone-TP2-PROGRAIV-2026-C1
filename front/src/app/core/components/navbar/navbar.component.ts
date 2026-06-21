import { Component, computed, inject, input, output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { SessionTimerService } from '../../services/session-timer.service';
import { PhotoSlotComponent } from '../photo-slot/photo-slot.component';
import { TimerComponent } from '../timer/timer.component';

interface SidebarItem {
  label: string;
  icon: string;
  route?: string;
  action?: () => void;
  active?: () => boolean;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, PhotoSlotComponent, TimerComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  readonly sessionTimer = inject(SessionTimerService);

  public readonly collapsed = input(false);
  public readonly toggleCollapse = output<void>();
  public readonly navItemActivated = output<void>();

  public readonly currentUser = this._authService.currentUser;

  public readonly menuItems = computed<SidebarItem[]>(() => {
    const user = this.currentUser();

    const items: SidebarItem[] = [];

    if (user) {
      items.push(
        { label: 'Inicio', icon: 'pi pi-images', route: '/publicaciones' },
        { label: 'Mi perfil', icon: 'pi pi-id-card', route: '/mi-perfil' },
      );

      if (user.role === 'admin') {
        items.push(
          { label: 'Gestionar usuarios', icon: 'pi pi-users', route: '/admin/usuarios' },
          { label: 'Estadísticas', icon: 'pi pi-chart-bar', route: '/admin/estadisticas' },
        );
      }

      items.push({
        label: 'Cerrar sesión',
        icon: 'pi pi-sign-out',
        action: () => {
          this.sessionTimer.stopTimer();
          this._authService.logout();
          this._router.navigate(['/login']);
        },
      });
    } else {
      items.push(
        { label: 'Login', icon: 'pi pi-sign-in', route: '/login' },
        { label: 'Registrarse', icon: 'pi pi-user-plus', route: '/registro' },
      );
    }

    return items;
  });

  public onItemClick(item: SidebarItem): void {
    this.onNavItemClick();
    item.action?.();
  }

  public onNavItemClick(): void {
    if (window.innerWidth <= 768) {
      this.toggleCollapse.emit();
    }
  }

  public onMobileHeaderClick(): void {
    if (window.innerWidth <= 768 && !this.collapsed()) {
      this.toggleCollapse.emit();
    }
  }

  public onTimerFinished(): void {
    this.sessionTimer.onTimerFinished();
  }
}
