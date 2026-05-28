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
      email: 'usuario1@mail.com',
      password: 'hola123',
    },
    {
      title: 'usuario2',
      email: 'usuario2@mail.com',
      password: 'hola123',
    },
    {
      title: 'usuario3',
      email: 'usuario3@mail.com',
      password: 'hola123',
    },
  ];
}
