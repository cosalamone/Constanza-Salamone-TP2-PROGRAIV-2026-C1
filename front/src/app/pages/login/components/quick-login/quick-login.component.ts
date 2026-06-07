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
      title: 'usuario1',
      username: 'usuario1',
      password: 'hola123',
    },
    {
      title: 'usuario2',
      username: 'usuario2',
      password: 'hola123',
    },
    {
      title: 'usuario3',
      username: 'usuario3',
      password: 'hola123',
    },
  ];
}
