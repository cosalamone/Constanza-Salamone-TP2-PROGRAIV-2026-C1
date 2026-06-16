import { Component, computed, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../../services/auth/auth.service';
import { PhotoSlotComponent } from '../photo-slot/photo-slot.component';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [MenubarModule, PhotoSlotComponent, NgStyle],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  private readonly _authService = inject(AuthService);

  public readonly currentUser = this._authService.currentUser;

  public readonly menuModel = computed<MenuItem[]>(() => {
    const user = this.currentUser();

    const items: MenuItem[] = [
      { label: 'Home', icon: 'pi pi-home', routerLink: '/inicio' },
      { label: 'Publicaciones', icon: 'pi pi-image', routerLink: '/publicaciones' },
      { label: 'Mi perfil', icon: 'pi pi-id-card', routerLink: '/mi-perfil' },
    ];

    if (user) {
      items.push({
        label: 'Cerrar sesión',
        icon: 'pi pi-sign-out',
        command: () => {
          this._authService.logout();
        },
        routerLink: '/login',
      });
    } else {
      items.push(
        { label: 'Registrarse', icon: 'pi pi-user-plus', routerLink: '/registro' },
        { label: 'Login', icon: 'pi pi-sign-in', routerLink: '/login' },
      );
    }

    return items;
  });
}
