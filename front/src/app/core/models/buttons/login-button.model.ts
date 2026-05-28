import { ButtonCommonComponent } from '../../components/buttons/common-button/common-button.component';
import { ButtonModelBase } from './button-base.model';

export class LoginButtonModel extends ButtonModelBase {
  constructor(button: Omit<LoginButtonModel, 'buttonType' | 'iconName' | 'style'>) {
    super(button as LoginButtonModel);
    this.buttonType = ButtonCommonComponent;
    this.label = button.label || 'Iniciar sesión';
  }
}
