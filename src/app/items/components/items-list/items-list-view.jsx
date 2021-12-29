import React from 'react';
import {useTable, usePagination, useSortBy} from 'react-table';
import {Pagination, Table} from "semantic-ui-react";
import ItemsTable from './items-table';

function ItemTable({items, columns, page: routerPage, sort: routerSort, pageSize: routerPageSize, queryChanged}) {
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
        state: {pageIndex, pageSize, sortBy}
    } = useTable({
            columns,
            data: items,
            initialState: {pageIndex: routerPage, pageSize: routerPageSize, sortBy: routerSortBy},
        },
        useSortBy,
        usePagination,
    );
    const sort = sortBy.length === 0 ? '' : `${sortBy[0].desc ? '-' : ''}${sortBy[0].id}`;
    React.useEffect(() => {
        queryChanged(pageIndex, sort, pageSize);
    }, [sortBy])
    const handlePageChange = (e, {activePage}) => {
        queryChanged(activePage - 1, sort, pageSize);
        gotoPage(activePage - 1);
    }
    return (
        <ItemsTable
            tableProps={getTableProps()}
            tableBodyProps={getTableBodyProps()}
            page={page}
            prepareRow={prepareRow}
            headerGroups={headerGroups}
        />
    )
}

export default ItemTable;
