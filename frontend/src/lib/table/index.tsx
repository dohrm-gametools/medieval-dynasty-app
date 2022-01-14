import * as React from 'react';

// https://codepen.io/paulobrien/pen/LBrMxa

const classnames = require('./index.module.css');


export interface ColumnDef<T extends { id: string }> {
  id: string;
  header: string;
  accessor: (value: T) => any;
  width?: number;
  sortable?: boolean;
  className?: string;
  // colSpan?: number;
}

export interface TableProps {
  columns: Array<ColumnDef<any>>;
  data: Array<any>;
  sort?: string;
  changeSort?: (sort: string) => any;
  footer?: React.ReactNode;
  classNames?: string;
  containerClassNames?: string;
}

export function generateSortFunction<T extends { id: string }>(sort: string, columns: Array<ColumnDef<T>>): (w1: T, w2: T) => number {
  return (w1: T, w2: T) => {
    if (sort === '') return 0;
    const descending = sort.indexOf('-') === 0;
    const key = descending ? sort.substring(1) : sort;
    const column = columns.find(c => c.id === key);
    if (!column) return 0;

    const val1 = column.accessor(w1);
    const val2 = column.accessor(w2);
    if (val1 < val2) return descending ? 1 : -1;
    if (val1 > val2) return descending ? -1 : 1;
    return 0;
  }
}

export function createColumnDef<K extends { id: string }>(
  id: string,
  width: number,
  prefix: string,
  t: (key: string) => string,
  sortable: boolean = false,
  accessor?: (v: K) => any,
): ColumnDef<K> {
  if (id === '') {
    return {
      id,
      width,
      sortable,
      header: '',
      accessor: accessor ? accessor : () => '',
    }
  }
  return {
    id,
    width,
    sortable,
    header: t(`${ prefix }.${ id }`),
    accessor: accessor ? accessor : v => (v as any)[ id ],
  }
}


const Table: React.ComponentType<TableProps> = (props) => {
  const totalColumns = props.columns.reduce((acc, c) => acc + 1, 0);
  if (totalColumns === 0) {
    return null;
  }
  const sizeByColumn = props.columns.reduce((acc: { [ key: string ]: string }, c) => ({
    ...acc,
    [ c.id ]: `${ (c.width || (1 / totalColumns) * 100) }%`
  }), {});
  const onSort = (id: string, direction: 'ascending' | 'descending' | '') => {
    if (props.changeSort) {
      if (direction === '') props.changeSort('');
      else if (direction === 'ascending') props.changeSort(id);
      else props.changeSort(`-${ id }`)
    }
  };
  return (
    <div className={ `${ classnames.container }${ props.containerClassNames ? ' ' + props.containerClassNames : '' }` }>
      <table className={ props.classNames }>
        <thead>
        <tr>
          { props.columns.map((c, idx) => {
            const isSorted = props.sort === c.id || props.sort === `-${ c.id }`;
            const direction = isSorted && props.sort ? (props.sort.indexOf('-') === 0 ? 'descending' : 'ascending') : undefined;
            return (
              <th key={ `header.${ c.id }` }
                  onClick={ () => c.sortable && props.changeSort && onSort(c.id, direction === 'ascending' ? 'descending' : (direction === 'descending' ? '' : 'ascending')) }
                  className={ (c.className || '') + ' ' + (c.sortable ? classnames.sortable : '') }
                  style={ { width: sizeByColumn[ c.id ] } }>
              <span className="d-flex justify-content-between">
                { c.header }
                { c.sortable && isSorted ? <i className={ `bi-sort-${ direction === 'ascending' ? 'up' : 'down' }` }/> : null }
              </span>
              </th>
            )
          }) }
        </tr>
        </thead>
        <tbody>
        { props.data.map((d, idx) => <tr key={ `row.${ idx }` }>{
          props.columns.map(c => <td key={ `cell.${ c.id }.${ idx }` } className={ c.className || '' }>{ c.accessor(d) }</td>)
        }</tr>) }
        </tbody>
        { props.footer ? (
          <tfoot>
          <tr>
            <th colSpan={ totalColumns }>
              { props.footer }
            </th>
          </tr>
          </tfoot>
        ) : null }
      </table>
    </div>
  );
}

export { Table };
