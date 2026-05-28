import { ButtonCommonComponent } from '../../../components/buttons/common-button/common-button.component';
import { ButtonModelBase } from '../button-base.model';

export class CancelIconButtonModel extends ButtonModelBase {
  constructor(button: Omit<CancelIconButtonModel, 'buttonType' | 'iconName'>) {
    super(button as CancelIconButtonModel);
    this.buttonType = ButtonCommonComponent;
    this.iconName = 'pi pi-times';
    this.style = button.style || 'icon-filled';
  }
}
