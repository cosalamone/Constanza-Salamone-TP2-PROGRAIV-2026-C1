import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { TableSelectOption } from '../../../../models/table/table-column.model';

@Component({
  selector: 'app-table-cell-dropdown',
  imports: [SelectModule, FormsModule],
  templateUrl: './table-cell-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCellDropdownComponent {
  public readonly value = input<string>('');
  public readonly options = input<readonly TableSelectOption[]>([]);
  public readonly placeholder = input<string>('Seleccione');
  public readonly className = input<string>('');
  public readonly valueChange = output<string>();
  public readonly dropdownOptions = computed(() => [...this.options()]);

  public dropdownStyleClass(): string {
    return ['table-base__dropdown', this.className()].filter(Boolean).join(' ');
  }
}
