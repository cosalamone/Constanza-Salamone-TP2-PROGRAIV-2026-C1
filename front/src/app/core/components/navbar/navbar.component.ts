import { Component, computed, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [MenubarModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private readonly _authService = inject(AuthService);

  public readonly menuModel = computed<MenuItem[]>(() => {
    const currentUser = true; // TODO, CORREGIR

    return [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/inicio',
      },
      {
        label: 'Publicaciones',
        icon: 'pi pi-search',
        routerLink: '/publicaciones',
      },
      {
        label: 'Mi perfil',
        icon: 'pi pi-id-card',
        routerLink: '/mi-perfil',
      },
      {
        label: 'Registrarse',
        icon: 'pi pi-user-plus',
        routerLink: '/registro',
      },
      {
        label: 'Login',
        icon: 'pi pi-sign-in',
        routerLink: '/login',
      },
      ...(currentUser
        ? [

            {
              label: 'Cerrar sesión',
              icon: 'pi pi-sign-out',
              command: () => {
                void this._authService.logout();
              },
              routerLink: '/login',
            },
          ]
        : [
           
          ]),
    ];
  });
}
