import React from 'react';
import {useTable, usePagination, useSortBy} from 'react-table';
import {Pagination, Table} from "semantic-ui-react";

const ItemTable = ({data, columns}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageCount,
    gotoPage,
    state: {pageIndex},
  } = useTable({
      columns,
      data,
      initialState: {pageIndex: 0},
    },
    useSortBy,
    usePagination,
  );
  const handlePageChange = (e, {activePage}) => gotoPage(activePage - 1);
  return (
    <Table celled {...getTableProps()}>
      <Table.Header>
        {headerGroups.map(headerGroup => (
          <Table.Row {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column =>
              <Table.HeaderCell
                icon={column.isSorted ? (column.isSortedDesc ? 'angle down' : 'angle up') : undefined}
                content={column.render('Header')}
                {...column.getHeaderProps(column.getSortByToggleProps())}/>)}
          </Table.Row>
        ))}
      </Table.Header>
      <Table.Body {...getTableBodyProps()}>
        {page.map((row) => {
          prepareRow(row);
          return (
            <Table.Row {...row.getRowProps()}>
              {row.cells.map(cell => <Table.Cell {...cell.getCellProps()}>{cell.render('Cell')}</Table.Cell>)}
            </Table.Row>
          )
        })}
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="4">
            <Pagination
              totalPages={pageCount}
              activePage={pageIndex + 1}
              onPageChange={handlePageChange}
            />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    </Table>
  )
}

export default ItemTable;
