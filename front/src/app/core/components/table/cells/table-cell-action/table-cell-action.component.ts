import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { of } from 'rxjs';
import { ButtonBaseComponent } from '../../../buttons/button-base/button-base.component';
import { ButtonCommonModel } from '../../../../models/buttons/button-common.model';

@Component({
  selector: 'app-table-cell-action',
  imports: [ButtonBaseComponent],
  templateUrl: './table-cell-action.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCellActionComponent {
  public readonly label = input<string>('Ver');
  public readonly className = input<string>('table-base__action-button');
  public readonly action = output<void>();
  public readonly buttonModel = computed(
    () =>
      new ButtonCommonModel({
        label: this.label(),
        severity: 'primary',
        style: 'outlined',
        action: () => this.action.emit(),
        permission: of({ allowed: true }),
        styleClass: this.className(),
      }),
  );
}
