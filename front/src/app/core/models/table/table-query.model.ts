export interface TableQuerySort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface TableQueryFilter {
  field: string;
  value: unknown;
  matchMode?: string;
  operator?: 'and' | 'or';
}

export interface TableQueryState {
  page: number;
  pageSize: number;
  skip: number;
  top: number;
  search: string;
  sort: TableQuerySort | null;
  filters: readonly TableQueryFilter[];
  raw?: unknown;
}
