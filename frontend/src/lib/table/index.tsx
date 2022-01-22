import * as React from 'react';

import {
  DataGrid,
  GridCallbackDetails,
  GridEnrichedColDef,
  GridSortModel,
  GridPagination,
  frFR as fr,
  enUS as en, GridLocaleText,
} from '@mui/x-data-grid';

import { useI18n } from '~/src/lib/i18n';

const locales: { [ key: string ]: Partial<GridLocaleText> } = {
  en: en.components.MuiDataGrid.defaultProps.localeText,
  fr: fr.components.MuiDataGrid.defaultProps.localeText,
};

export interface ColumnDef<T extends { id: string }> {
  id: string;
  header: string;
  accessor?: (value: T) => any;
  render?: (v: T) => React.ReactNode;
  renderHeader?: () => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  headerAlign?: 'left' | 'center' | 'right';
  // With in percentage
  width?: number;
  sortable?: boolean;
  className?: string;
  // colSpan?: number;
}

export interface TableProps<T extends { id: string }> {
  tableId: string;
  columns: Array<ColumnDef<T>>;
  data: Array<any>;
  totalCount: number;
  height?: string;
  width?: string;
  sort?: string;
  changeSort?: (sort: string) => any;
  page?: number;
  pageSize?: number;
  changePage?: (page: number) => any;
  changePageSize?: (pageSize: number) => any;
  toolbar?: React.ReactNode;
}

export function generateSortFunction<T extends { id: string }>(sort: string, columns: Array<ColumnDef<T>>): (w1: T, w2: T) => number {
  return (w1: T, w2: T) => {
    if (sort === '') return 0;
    const descending = sort.indexOf('-') === 0;
    const key = descending ? sort.substring(1) : sort;
    const column = columns.find(c => c.id === key);
    if (!column) return 0;
    if (column.accessor) {
      const val1 = column.accessor(w1);
      const val2 = column.accessor(w2);
      if (typeof val1 === 'string' && typeof val2 === 'string') {
        if (val1.toLowerCase() < val2.toLowerCase()) return descending ? 1 : -1;
        if (val1.toLowerCase() > val2.toLowerCase()) return descending ? -1 : 1;
      } else if (typeof val1 === 'number' && typeof val2 === 'number') {
        if (val1 < val2) return descending ? 1 : -1;
        if (val1 > val2) return descending ? -1 : 1;
      }
    }
    return 0;
  }
}

export function createColumnDef<K extends { id: string }>(
  id: string,
  width: number,
  prefix: string,
  t: (key: string) => string,
  options?: {
    sortable?: boolean;
    accessor?: (v: K) => any;
    render?: (v: K) => React.ReactNode;
    renderHeader?: () => React.ReactNode;
    headerAlign?: 'left' | 'center' | 'right';
    align?: 'left' | 'center' | 'right';
  }
): ColumnDef<K> {
  const common = {
    id,
    width,
    sortable: options?.sortable || false,
    render: options?.render,
    renderHeader: options?.renderHeader,
    headerAlign: options?.headerAlign,
    align: options?.align,
  }
  if (id === '') {
    return {
      ...common,
      header: '',
      accessor: options?.accessor,
    }
  }
  return {
    ...common,
    header: t(`${ prefix }.${ id }`),
    accessor: options?.accessor || (options?.render ? undefined : v => (v as any)[ id ]),
  }
}

function Table<T extends { id: string }, C = T>(props: TableProps<T>): React.ReactElement | null {
  const { lang } = useI18n();
  const totalColumns = React.useMemo(() => props.columns.reduce((acc, c) => acc + 1, 0), [ props.columns ]);
  const sizeByColumn = React.useMemo(() => props.columns.reduce((acc: { [ key: string ]: number }, c) => ({
    ...acc,
    [ c.id ]: (c.width || ((1 / totalColumns) * 100))
  }), {}), [ props.columns ]);
  const columns = React.useMemo(() => props.columns.map<GridEnrichedColDef>(c => ({
    field: c.id,
    headerName: c.header,
    sortable: c.sortable,
    filterable: false,
    minWidth: 100,
    flex: sizeByColumn[ c.id ],
    renderCell: c.render ? (params => c.render && c.render(params.row)) : undefined,
    valueGetter: c.accessor ? ((params) => c.accessor && c.accessor(params.row)) : undefined,
    renderHeader: c.renderHeader ? () => c.renderHeader && c.renderHeader() : undefined,
    headerAlign: c.headerAlign,
    align: c.align,
  })), [ props.columns ]);

  if (totalColumns === 0) {
    return null;
  }

  const onSort = (model: GridSortModel, details: GridCallbackDetails) => {
    if (props.changeSort) {
      if (model.length > 0) {
        props.changeSort(`${ model[ 0 ].sort === 'desc' ? '-' : '' }${ model[ 0 ].field }`)
      } else {
        props.changeSort('');
      }
    }
  };
  const onPageChange = (page: number, details: GridCallbackDetails) => {
    if (props.changePage) props?.changePage(page);
  };
  const onPageSizeChange = (pageSize: number, details: GridCallbackDetails) => {
    if (props.changePageSize) props.changePageSize(pageSize);
  };
  const isSorted = !!props.sort && props.sort !== '';
  const sortType = isSorted ? (props.sort?.indexOf('-') === 0 ? 'desc' : 'asc') : undefined;
  const sortColumn = isSorted ? (sortType === 'asc' ? props.sort : (props.sort || '-').substring(1)) : undefined;
  const sort: GridSortModel = sortColumn ? [ { field: sortColumn, sort: sortType } ] : [];
  return (
    <div style={ { width: props.width || '100%', height: props.height || '100%' } }>
      <DataGrid
        disableSelectionOnClick
        localeText={ locales[ lang ] || locales[ 'fr' ] }
        key={ props.tableId }
        columns={ columns }
        rows={ props.data }
        sortModel={ sort }
        onSortModelChange={ onSort }
        sortingMode={ !props.changeSort && !props.changePage ? "client" : "server" }
        pageSize={ props?.pageSize }
        page={ (props?.page || 0) }
        rowCount={ props.totalCount }
        onPageChange={ onPageChange }
        onPageSizeChange={ onPageSizeChange }
        hideFooterPagination={ !props.changePage }
        paginationMode="server"
        components={ {
          Toolbar: () => props.toolbar ? <>{ props.toolbar }</> : null
        } }
      />
    </div>
  );
}

export { Table };
