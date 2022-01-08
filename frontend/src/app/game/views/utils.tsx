import * as React from 'react';
import { SemanticWIDTHS, Table } from 'semantic-ui-react';

export type SortType = { id: string, direction: 'ascending' | 'descending' } | undefined;
export type ColumnType = { id: string, rowSpan?: SemanticWIDTHS, colSpan?: SemanticWIDTHS, width?: SemanticWIDTHS };

export function mapColumn(item: ColumnType, i18nPrefix: string, t: (key: string) => string, sort: SortType, setSort: (sort: SortType) => any) {
  const isSorted = sort && sort.id === item.id;
  const direction = isSorted ? sort.direction : undefined;
  const nextDirection = isSorted ? (direction === 'descending' ? undefined : 'ascending') : 'descending';
  return (
    <Table.HeaderCell
      key={ item.id }
      sorted={ direction }
      content={ item.id === '' ? '' : t(`${ i18nPrefix }.${ item.id }`) }
      rowSpan={ item.rowSpan }
      colSpan={ item.colSpan }
      width={ item.width }
      onClick={ () => setSort(nextDirection && { id: item.id, direction: nextDirection }) }
    />
  )
}
