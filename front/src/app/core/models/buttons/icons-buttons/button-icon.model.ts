import { IconButtonComponent } from '../../../components/buttons/icon-button/icon-button.component';
import { ButtonModelBase } from '../button-base.model';

export class ButtonIconModel extends ButtonModelBase {
  constructor(button: Omit<ButtonIconModel, 'buttonType'>) {
    super(button as ButtonIconModel);
    this.style = button.style || 'icon-filled';
    this.buttonType = IconButtonComponent;
  }
}
