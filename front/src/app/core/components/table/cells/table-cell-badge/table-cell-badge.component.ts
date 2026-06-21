import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-table-cell-badge',
  templateUrl: './table-cell-badge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCellBadgeComponent {
  public readonly value = input<string>('');
  public readonly fallbackText = input<string>('-');
  public readonly className = input<string>('table-base__badge');
}
