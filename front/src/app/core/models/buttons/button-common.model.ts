import { ButtonCommonComponent } from '../../components/buttons/common-button/common-button.component';
import { ButtonModelBase } from './button-base.model';

export class ButtonCommonModel extends ButtonModelBase {
  constructor(button: Omit<ButtonCommonModel, 'buttonType'>) {
    super(button as ButtonCommonModel);
    this.buttonType = ButtonCommonComponent;
  }
}
