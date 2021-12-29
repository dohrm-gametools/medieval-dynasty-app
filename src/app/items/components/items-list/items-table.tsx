import * as React from 'react';
import { Pagination, Table } from 'semantic-ui-react';
import {
  TableProps,
  HeaderGroup,
  TableBodyProps,
  Row,
  UseSortByColumnProps,
} from 'react-table';
import { Item } from '~/src/api';

export interface ItemsHeaderGroup extends HeaderGroup<Item> {
  headers: Array<HeaderGroup<Item> & UseSortByColumnProps<Item>>
}

export interface Props {
  tableProps: TableProps;
  tableBodyProps: TableBodyProps;
  headerGroups: Array<ItemsHeaderGroup>;
  page: Array<Row<Item>>;
  prepareRow: (row: Row<Item>) => any;
}

const ItemsTable: React.ComponentType<Props> =
  ({
     tableProps,
     tableBodyProps,
     headerGroups,
     page,
     prepareRow
   }) => (
    <Table celled compact { ...tableProps }>
      <Table.Header fullWidth>
        { headerGroups.map(headerGroup => (
          <Table.Row { ...headerGroup.getHeaderGroupProps() }>
            { headerGroup.headers.map(column =>
              <Table.HeaderCell
                icon={ column.isSorted ? (column.isSortedDesc ? 'angle down' : 'angle up') : undefined }
                content={ column.render('Header') }
                { ...column.getHeaderProps(column.getSortByToggleProps()) }/>) }
          </Table.Row>
        )) }
      </Table.Header>
      <Table.Body { ...tableBodyProps }>
        { page.map((row) => {
          prepareRow(row);
          return (
            <Table.Row { ...row.getRowProps() }>
              { row.cells.map(cell =>
                <Table.Cell { ...cell.getCellProps() }>{ cell.render('Cell') }</Table.Cell>) }
            </Table.Row>
          )
        }) }
      </Table.Body>
    </Table>
  )

export default ItemsTable;
