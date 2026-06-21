import { Component, EventEmitter, Output } from '@angular/core';
import { ILogin } from '../../../../core/interfaces/auth-interfaces/auth.interfaces';
import { CardBaseComponent } from '../../../../core/components/card-base/card-base';

interface QuickLoginUser extends ILogin {
  title: string;
}

@Component({
  selector: 'app-quick-login',
  imports: [CardBaseComponent],
  templateUrl: './quick-login.component.html',
})
export class QuickLoginComponent {
  @Output() public readonly quickLoginSelected = new EventEmitter<ILogin>();

  public readonly users: QuickLoginUser[] = [
    {
      title: 'juan_perez',
      username: 'juan_perez',
      password: 'Hola123!',
    },
    {
      title: 'connie_sol',
      username: 'connie_sol',
      password: 'Hola123!',
    },
    {
      title: 'nueva_usuaria',
      username: 'nueva_usuaria',
      password: 'Hola123!',
    },
    {
      title: 'soy_jose_admin',
      username: 'soy_jose_admin',
      password: 'Hola123!',
    },
  ];
}
