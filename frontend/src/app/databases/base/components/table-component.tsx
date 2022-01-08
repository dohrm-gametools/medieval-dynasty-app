import * as React from 'react';
import { Table } from 'semantic-ui-react';

export interface Column<T extends { id: string }> {
  id: string;
  header: string;
  accessor: (value: T) => any;
}

export interface Props {
  columns: Array<Column<any>>;
  data: Array<any>;
  sort: string;
  changeSort: (sort: string) => any;
}

const BuildingsTable: React.ComponentType<Props> =
  ({
     columns,
     data,
     sort,
     changeSort,
   }) => (
    <Table id="items-table" celled striped compact fixed sortable={ true }>
      <Table.Header fullWidth>
        <Table.Row>
          { columns.map(column => {
            const isSorted = sort === column.id || sort === `-${ column.id }`;
            const direction = isSorted ? (sort.indexOf('-') === 0 ? 'descending' : 'ascending') : undefined;
            return (
              <Table.HeaderCell
                key={ `header-${ column.id }` }
                sorted={ direction }
                content={ column.header }
                onClick={ () => changeSort(direction === 'ascending' ? `-${ column.id }` : (direction === 'descending' ? '' : column.id)) }
              />
            )
          }) }
        </Table.Row>
      </Table.Header>
      <Table.Body>
        { data.map((row, idx) => {
          return (
            <Table.Row key={ `row-${ row.id }` }>
              {
                columns.map(column => {
                  return <Table.Cell key={ `${ column.id }-${ row.id }` }>{ column.accessor(row) }</Table.Cell>
                })
              }
            </Table.Row>
          )
        }) }
      </Table.Body>
    </Table>
  )

export default BuildingsTable;
