import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { formatDate } from '@angular/common';
import { TableColumn, TableColumnAlign } from '../../../models/table/table-column.model';
import { TableCellTextComponent } from '../cells/table-cell-text/table-cell-text.component';
import { TableCellBadgeComponent } from '../cells/table-cell-badge/table-cell-badge.component';
import { TableCellActionComponent } from '../cells/table-cell-action/table-cell-action.component';
import { TableCellInputComponent } from '../cells/table-cell-input/table-cell-input.component';
import { TableCellIconComponent } from '../cells/table-cell-icon/table-cell-icon.component';
import { TableCellDropdownComponent } from '../cells/table-cell-dropdown/table-cell-dropdown.component';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TableQueryFilter, TableQueryState } from '../../../models/table/table-query.model';

@Component({
  selector: 'app-table-base',
  imports: [
    TableModule,
    TableCellTextComponent,
    TableCellBadgeComponent,
    TableCellActionComponent,
    TableCellInputComponent,
    TableCellIconComponent,
    TableCellDropdownComponent,
  ],
  templateUrl: './table-base.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableBaseComponent {
  public readonly title = input<string>('');
  public readonly recordsLabel = input<string>('');
  public readonly emptyMessage = input<string>('');
  public readonly idProp = input<string | null>(null);
  public readonly paginator = input<boolean>(true);
  public readonly lazy = input<boolean>(false);
  public readonly rowsPerPage = input<number>(10);
  public readonly totalRecords = input<number | null>(null);
  public readonly searchTerm = input<string>('');
  public readonly scrollable = input<boolean>(true);
  public readonly scrollHeight = input<string>('flex');
  public readonly columns = input.required<readonly TableColumn[]>();
  public readonly rows = input.required<readonly Record<string, unknown>[]>();
  public readonly cellAction = output<{ columnId: string; row: Record<string, unknown> }>();
  public readonly cellValueChange = output<{
    columnId: string;
    row: Record<string, unknown>;
    value: string;
  }>();
  public readonly queryChange = output<TableQueryState>();

  public readonly data = computed(() => [...this.rows()]);
  public readonly resolvedTotalRecords = computed(() => this.totalRecords() ?? this.rows().length);
  private readonly resolvedLabel = computed(
    () => this.recordsLabel().trim() || this.title().trim(),
  );
  public readonly paginatorCurrentPageReportTemplate = computed(() => {
    const label = this.resolvedLabel();
    return label ? `Total {totalRecords} ${label}` : 'Total {totalRecords} registros';
  });
  public readonly resolvedEmptyMessage = computed(() => {
    const custom = this.emptyMessage().trim();
    if (custom) return custom;
    const label = this.resolvedLabel();
    return label ? `No hay ${label} para mostrar` : 'No hay datos para mostrar';
  });

  public trackColumn(_: number, column: TableColumn): string {
    return column.id;
  }

  public headerClass(column: TableColumn): string {
    return (
      this.buildAlignClass('table-base__header-cell', column.header.align) +
      (column.header.variant === 'muted' ? ' table-base__header-cell--muted' : '')
    );
  }

  public cellClass(column: TableColumn): string {
    return this.buildAlignClass('table-base__cell', column.cell.align);
  }

  public badgeClass(column: TableColumn, row: Record<string, unknown>): string {
    const resolvedClassName = this.resolveClassName(column.cell.badgeClassName, row);
    return 'table-base__badge' + (resolvedClassName ? ` ${resolvedClassName}` : '');
  }

  public actionClass(column: TableColumn, row: Record<string, unknown>): string {
    const resolvedClassName = this.resolveClassName(column.cell.actionClassName, row);
    return 'table-base__action-button' + (resolvedClassName ? ` ${resolvedClassName}` : '');
  }

  public iconClass(column: TableColumn, row: Record<string, unknown>): string {
    return this.resolveClassName(column.cell.iconClassName, row);
  }

  public iconTitle(column: TableColumn, row: Record<string, unknown>): string {
    return this.resolveClassName(column.cell.iconTitle, row);
  }

  public valueClass(column: TableColumn, row: Record<string, unknown>): string {
    return this.resolveClassName(column.cell.valueClassName, row);
  }

  public emitCellAction(column: TableColumn, row: Record<string, unknown>): void {
    this.cellAction.emit({ columnId: column.id, row });
  }

  public emitCellValueChange(
    column: TableColumn,
    row: Record<string, unknown>,
    value: string,
  ): void {
    this.cellValueChange.emit({ columnId: column.id, row, value });
  }

  public emitQueryChange(event: TableLazyLoadEvent): void {
    const first = event.first ?? 0;
    const pageSize = event.rows ?? this.rowsPerPage();
    const rawSortField = event.sortField;
    const sortField = Array.isArray(rawSortField) ? (rawSortField[0] ?? '') : (rawSortField ?? '');
    const sortOrder = event.sortOrder ?? 0;

    this.queryChange.emit({
      page: pageSize > 0 ? Math.floor(first / pageSize) + 1 : 1,
      pageSize,
      skip: first,
      top: pageSize,
      search: this.searchTerm().trim(),
      sort:
        sortField && sortOrder !== 0
          ? {
              field: sortField,
              direction: sortOrder > 0 ? 'asc' : 'desc',
            }
          : null,
      filters: this.normalizeFilters(event.filters),
      raw: event,
    });
  }

  public resolveCellValue(row: Record<string, unknown>, column: TableColumn): string {
    const rawValue = row[column.cell.field];
    const cellKind = column.cell.kind ?? 'text';

    if (cellKind === 'input' || cellKind === 'dropdown') {
      return rawValue === null || rawValue === undefined ? '' : String(rawValue);
    }

    const formattedValue = column.cell.formatter?.(rawValue, row);

    if (formattedValue !== undefined) {
      return formattedValue;
    }

    if (rawValue === null || rawValue === undefined || rawValue === '') {
      return column.cell.fallbackText ?? '-';
    }

    if (cellKind === 'date') {
      try {
        const format = column.cell.dateFormat ?? 'dd/MM/yyyy HH:mm';
        return formatDate(rawValue as string | number | Date, format, 'en-US');
      } catch {
        return column.cell.fallbackText ?? '-';
      }
    }

    return String(rawValue);
  }

  private buildAlignClass(base: string, align?: TableColumnAlign): string {
    return (
      base + (align === 'center' ? ` ${base}--center` : align === 'right' ? ` ${base}--right` : '')
    );
  }

  private resolveClassName(
    className: string | ((row: Record<string, unknown>) => string) | undefined,
    row: Record<string, unknown>,
  ): string {
    if (!className) return '';

    return typeof className === 'function' ? className(row) : className;
  }

  private normalizeFilters(filters: unknown): readonly TableQueryFilter[] {
    if (!filters || typeof filters !== 'object') {
      return [];
    }

    return Object.entries(filters as Record<string, unknown>).flatMap(([field, value]) => {
      if (!value || typeof value !== 'object') {
        return [];
      }

      const typedValue = value as {
        value?: unknown;
        matchMode?: string;
        operator?: 'and' | 'or';
        constraints?: Array<{ value?: unknown; matchMode?: string }>;
      };

      if (Array.isArray(typedValue.constraints) && typedValue.constraints.length > 0) {
        return typedValue.constraints
          .filter(
            (constraint) =>
              constraint.value !== undefined &&
              constraint.value !== null &&
              constraint.value !== '',
          )
          .map((constraint) => ({
            field,
            value: constraint.value,
            matchMode: constraint.matchMode,
            operator: typedValue.operator ?? 'and',
          }));
      }

      if (typedValue.value === undefined || typedValue.value === null || typedValue.value === '') {
        return [];
      }

      return [
        {
          field,
          value: typedValue.value,
          matchMode: typedValue.matchMode,
          operator: typedValue.operator ?? 'and',
        },
      ];
    });
  }
}
