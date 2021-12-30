import * as React from 'react';
import { Table } from 'semantic-ui-react';
import { HeaderGroup, Row, TableBodyProps, TableProps, } from 'react-table';

export interface Props {
  tableProps: TableProps;
  tableBodyProps: TableBodyProps;
  headerGroups: Array<HeaderGroup<any>>;
  data: Array<Row<any>>;
  prepareRow: (row: Row<any>) => any;
  sort: string;
  changeSort: (sort: string) => any;
}

const BuildingsTable: React.ComponentType<Props> =
  ({
     tableProps,
     tableBodyProps,
     headerGroups,
     data,
     prepareRow,
     sort,
     changeSort,
   }) => (
    <Table id="items-table" celled striped compact inverted { ...tableProps } fixed sortable={ true }>
      <Table.Header fullWidth>
        { headerGroups.map(headerGroup => (
          <Table.Row { ...headerGroup.getHeaderGroupProps() }>
            { headerGroup.headers.map(column => {
              const isSorted = sort === column.id || sort === `-${ column.id }`;
              const direction = isSorted ? (sort.indexOf('-') === 0 ? 'descending' : 'ascending') : undefined;
              return (
                <Table.HeaderCell
                  sorted={ direction }
                  content={ column.render('Header') }
                  onClick={ () => changeSort(direction === 'ascending' ? `-${ column.id }` : (direction === 'descending' ? '' : column.id)) }
                  { ...column.getHeaderProps() }/>
              )
            }) }
          </Table.Row>
        )) }
      </Table.Header>
      <Table.Body { ...tableBodyProps }>
        { data.map((row) => {
          prepareRow(row);
          return (
            <Table.Row { ...row.getRowProps() }>
              { row.cells.map(cell => <Table.Cell { ...cell.getCellProps() }>{ cell.render('Cell') }</Table.Cell>) }
            </Table.Row>
          )
        }) }
      </Table.Body>
    </Table>
  )

export default BuildingsTable;
