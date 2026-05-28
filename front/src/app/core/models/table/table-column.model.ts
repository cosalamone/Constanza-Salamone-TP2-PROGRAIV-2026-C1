export type TableColumnAlign = 'left' | 'center' | 'right';
export type TableHeaderVariant = 'default' | 'muted';
export type TableCellKind = 'text' | 'badge' | 'action' | 'input' | 'icon' | 'dropdown' | 'date';

export interface TableSelectOption {
  label: string;
  value: string;
}

export interface TableHeaderConfig {
  label: string;
  align?: TableColumnAlign;
  variant?: TableHeaderVariant;
}

export interface TableCellConfig {
  field: string;
  kind?: TableCellKind;
  align?: TableColumnAlign;
  fallbackText?: string;
  formatter?: (value: unknown, row: Record<string, unknown>) => string | undefined;
  valueClassName?: string | ((row: Record<string, unknown>) => string);
  badgeClassName?: string | ((row: Record<string, unknown>) => string);
  actionClassName?: string | ((row: Record<string, unknown>) => string);
  actionLabel?: string;
  iconClassName?: string | ((row: Record<string, unknown>) => string);
  iconTitle?: string | ((row: Record<string, unknown>) => string);
  inputType?: 'text' | 'number' | 'email' | 'password';
  inputPlaceholder?: string;
  selectOptions?: readonly TableSelectOption[];
  selectPlaceholder?: string;
  dateFormat?: string;
}

export interface TableColumn {
  id: string;
  header: TableHeaderConfig;
  cell: TableCellConfig;
}
