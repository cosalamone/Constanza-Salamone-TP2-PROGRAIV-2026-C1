import { ButtonCommonComponent } from '../../../components/buttons/common-button/common-button.component';
import { ButtonModelBase } from '../button-base.model';

export class DeleteIconButtonModel extends ButtonModelBase {
  constructor(button: Omit<DeleteIconButtonModel, 'buttonType' | 'iconName'>) {
    super(button as DeleteIconButtonModel);
    this.buttonType = ButtonCommonComponent;
    this.iconName = 'pi pi-trash';
    this.style = button.style || 'icon-filled';
  }
}
