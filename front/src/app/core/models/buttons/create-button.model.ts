import { ButtonCommonComponent } from '../../components/buttons/common-button/common-button.component';
import { ButtonModelBase } from './button-base.model';

export class CreateButtonModel extends ButtonModelBase {
  constructor(button: Omit<CreateButtonModel, 'buttonType' | 'iconName' | 'style'>) {
    super(button as CreateButtonModel);
    this.buttonType = ButtonCommonComponent;
    this.label = button.label || 'Crear';
  }
}
