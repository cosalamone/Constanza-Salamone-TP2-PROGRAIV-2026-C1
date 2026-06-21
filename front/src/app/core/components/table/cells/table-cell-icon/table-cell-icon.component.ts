import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-table-cell-icon',
  templateUrl: './table-cell-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCellIconComponent {
  public readonly className = input<string>('');
  public readonly title = input<string>('');
}
