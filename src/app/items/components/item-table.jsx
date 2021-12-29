import React from 'react';
import {useTable, usePagination, useSortBy} from 'react-table';
import {Pagination, Table} from "semantic-ui-react";

const ItemTable = ({items, columns, page: routerPage, sort: routerSort, queryChanged}) => {
  const routerSortBy = [];
  if (routerSort !== '') {
    routerSortBy.push({id: routerSort.replace('-', ''), desc: routerSort.indexOf('-') === 0})
  }
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageCount,
    gotoPage,
    state: {pageIndex, sortBy},
  } = useTable({
      columns,
      data: items,
      initialState: {pageIndex: routerPage, sortBy: routerSortBy},
    },
    useSortBy,
    usePagination,
  );
  const sort = sortBy.length === 0 ? '' : `${sortBy[0].desc ? '-' : ''}${sortBy[0].id}`;
  React.useEffect(() => {
    queryChanged(pageIndex, sort);
  }, [sortBy])
  const handlePageChange = (e, {activePage}) => {
    queryChanged(activePage - 1, sort);
    gotoPage(activePage - 1);
  }
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
