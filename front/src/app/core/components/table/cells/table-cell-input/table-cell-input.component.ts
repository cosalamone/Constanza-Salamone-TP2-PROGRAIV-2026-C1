import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-table-cell-input',
  templateUrl: './table-cell-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCellInputComponent {
  public readonly value = input<string>('');
  public readonly type = input<'text' | 'number' | 'email' | 'password'>('text');
  public readonly placeholder = input<string>('');
  public readonly className = input<string>('');
  public readonly valueChange = output<string>();
}
