import { ButtonCommonComponent } from '../../components/buttons/common-button/common-button.component';
import { ButtonModelBase } from './button-base.model';

export class RegisterButtonModel extends ButtonModelBase {
  constructor(button: Omit<RegisterButtonModel, 'buttonType' | 'iconName' | 'style'>) {
    super(button as RegisterButtonModel);
    this.buttonType = ButtonCommonComponent;
    this.type = button.type || 'submit';
    this.label = button.label || 'Registrarse';
  }
}
