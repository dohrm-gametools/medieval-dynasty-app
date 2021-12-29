import * as React from 'react';
import { Column, useTable } from 'react-table';
import { useDispatch, useSelector } from 'react-redux';

import { useI18n } from '~/src/app/i18n';
import { Building } from '~/src/api';
import { changeParams, selectors } from '~/src/app/databases/buildings/reducer';
import { default as BuildingsTable } from './buildings-table';
import { default as BuildingsPagination } from './buildings-pagination';

export interface Props {queryChanged: (page: number, sort: string, pageSize: number) => any;}

const columnsFactory = (t: (key: string) => string, lang: string): Array<Column<Building>> => [
  { id: 'category', Header: t('buildings.table.headers.category'), accessor: d => t(`buildings.category.${ d.category.valueOf() }`) },
  { id: 'name', Header: t('buildings.table.headers.name'), accessor: d => d.i18n[ lang ] },
  { id: 'tax', Header: t('buildings.table.headers.tax'), accessor: d => d.tax },
  { id: 'storage', Header: t('buildings.table.headers.storage'), accessor: d => d.storage },
  { id: 'worker', Header: t('buildings.table.headers.worker'), accessor: d => d.worker },
];

const ItemsListView: React.ComponentType<Props> = ({ queryChanged }) => {
  const { t, lang } = useI18n();
  const columns = React.useMemo<Array<Column<Building>>>(() => columnsFactory(t, lang), [ lang ]);
  const dispatch = useDispatch();
  const items = useSelector(selectors.paginatedItems);
  const sort = useSelector(selectors.sort);
  const page = useSelector(selectors.page);
  const pageSize = useSelector(selectors.pageSize);
  const totalCount = useSelector(selectors.totalCount);
  const updateParams = (sort: string, page: number, pageSize: number) => {
    queryChanged(page, sort, pageSize);
    dispatch(changeParams({ sort: sort as any, page, pageSize }));
  }
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows, } = useTable({ columns, data: items, });

  return (
    <>
      <BuildingsTable
        tableProps={ getTableProps() }
        tableBodyProps={ getTableBodyProps() }
        data={ rows }
        prepareRow={ prepareRow }
        headerGroups={ headerGroups }
        sort={ sort }
        changeSort={ newSort => updateParams(newSort, page, pageSize) }
      />
      <BuildingsPagination
        pageSize={ pageSize }
        page={ page }
        total={ totalCount }
        changePage={ newPage => updateParams(sort, newPage, pageSize) }
        changePageSize={ newPageSize => updateParams(sort, 0, newPageSize) }
      />
    </>
  )
};

export default ItemsListView;
