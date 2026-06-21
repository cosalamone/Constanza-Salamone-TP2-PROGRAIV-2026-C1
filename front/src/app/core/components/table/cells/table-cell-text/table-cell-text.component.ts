import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-table-cell-text',
  templateUrl: './table-cell-text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCellTextComponent {
  public readonly value = input<string>('');
  public readonly fallbackText = input<string>('-');
  public readonly className = input<string>('');
}
