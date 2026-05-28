import { ButtonCommonComponent } from '../../../components/buttons/common-button/common-button.component';
import { ButtonModelBase } from '../button-base.model';

export class CheckIconButtonModel extends ButtonModelBase {
  constructor(button: Omit<CheckIconButtonModel, 'buttonType' | 'iconName'>) {
    super(button as CheckIconButtonModel);
    this.buttonType = ButtonCommonComponent;
    this.iconName = 'pi pi-check';
    this.style = button.style || 'icon-filled';
  }
}
