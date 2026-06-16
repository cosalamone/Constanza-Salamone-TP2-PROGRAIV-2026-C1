import { Component, computed, inject, input, output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { PhotoSlotComponent } from '../photo-slot/photo-slot.component';
import { ButtonBaseComponent } from '../buttons/button-base/button-base.component';
import { ButtonIconModel } from '../../models/buttons/icons-buttons/button-icon.model';
import { ButtonCommonModel } from '../../models/buttons/button-common.model';
import { of } from 'rxjs';

interface SidebarItem {
  label: string;
  icon: string;
  route?: string;
  action?: () => void;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, PhotoSlotComponent, ButtonBaseComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  public readonly collapsed = input(false);
  public readonly toggleCollapse = output<void>();
  public readonly navItemActivated = output<void>();

  public readonly currentUser = this._authService.currentUser;

  public readonly collapseButtonModel = computed(
    () =>
      new ButtonIconModel({
        iconName: this.collapsed() ? 'pi pi-angle-right' : 'pi pi-angle-left',
        action: () => this.toggleCollapse.emit(),
        permission: of({ allowed: true }),
        styleClass: 'collapse-btn',
        tooltipMessage: 'Colapsar menú',
      }),
  );

  public readonly closeButtonModel = computed(
    () =>
      new ButtonIconModel({
        iconName: 'pi pi-times',
        action: () => this.toggleCollapse.emit(),
        permission: of({ allowed: true }),
        styleClass: 'close-btn',
        tooltipMessage: 'Cerrar menú',
      }),
  );

  public getSidebarItemButtonModel(item: SidebarItem): ButtonCommonModel {
    return new ButtonCommonModel({
      iconName: item.icon,
      label: item.label,
      action: () => {
        this.onNavItemClick();
        item.action?.();
      },
      permission: of({ allowed: true }),
      styleClass: 'sidebar-item',
    });
  }

  public readonly menuItems = computed<SidebarItem[]>(() => {
    const user = this.currentUser();

    const items: SidebarItem[] = [
      { label: 'Inicio', icon: 'pi pi-images', route: '/publicaciones' },
      { label: 'Mi perfil', icon: 'pi pi-id-card', route: '/mi-perfil' },
    ];

    if (user) {
      items.push({
        label: 'Cerrar sesión',
        icon: 'pi pi-sign-out',
        action: () => {
          this._authService.logout();
          this._router.navigate(['/login']);
        },
      });
    } else {
      items.push(
        { label: 'Registrarse', icon: 'pi pi-user-plus', route: '/registro' },
        { label: 'Login', icon: 'pi pi-sign-in', route: '/login' },
      );
    }

    return items;
  });

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
}
