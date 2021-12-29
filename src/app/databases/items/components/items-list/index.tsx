import * as React from 'react';
import { Column, useTable } from 'react-table';
import { useDispatch, useSelector } from 'react-redux';

import { useI18n } from '~/src/app/i18n';
import { Item } from '~/src/api';
import { changeParams, selectors } from '~/src/app/databases/items/reducer';
import { default as ItemsTable } from './items-table';
import { default as ItemsPagination } from './items-pagination';

export interface Props {queryChanged: (page: number, sort: string, pageSize: number) => any;}

const columnsFactory = (t: (key: string) => string, lang: string): Array<Column<Item>> => [
  { id: 'category', Header: t('items.table.headers.category'), accessor: d => t(`items.category.${ d.category.valueOf() }`) },
  { id: 'name', Header: t('items.table.headers.name'), accessor: d => d.i18n[ lang ] },
  { id: 'durability', Header: t('items.table.headers.durability'), accessor: d => d.durability },
  { id: 'weight', Header: t('items.table.headers.weight'), accessor: d => d.weight },
  { id: 'price', Header: t('items.table.headers.price'), accessor: d => d.price }
  // { id: 'damage', Header: t('items.headers.damage'), accessor: d => d.damage },
  // { id: 'poisoning', Header: t('items.headers.poisoning'), accessor: d => d.poisoning },
  // { id: 'extraction', Header: t('items.headers.extraction'), accessor: d => d.extraction },
  // { id: 'heat', Header: t('items.headers.heat'), accessor: d => d.heat },
  // { id: 'cold', Header: t('items.headers.cold'), accessor: d => d.cold },
  // { id: 'weightLimit', Header: t('items.headers.weightLimit'), accessor: d => d.weightLimit },
  // { id: 'health', Header: t('items.headers.health'), accessor: d => d.health },
  // { id: 'stamina', Header: t('items.headers.stamina'), accessor: d => d.stamina },
  // { id: 'food', Header: t('items.headers.food'), accessor: d => d.food },
  // { id: 'water', Header: t('items.headers.water'), accessor: d => d.water },
  // { id: 'wood', Header: t('items.headers.wood'), accessor: d => d.wood },
  // { id: 'alcohol', Header: t('items.headers.alcohol'), accessor: d => d.alcohol },
  // { id: 'foodConsumption', Header: t('items.headers.foodConsumption'), accessor: d => d.foodConsumption },
  // { id: 'waterConsumption', Header: t('items.headers.waterConsumption'), accessor: d => d.waterConsumption },
  // { id: 'staminaConsumption', Header: t('items.headers.staminaConsumption'), accessor: d => d.staminaConsumption },
  // { id: 'additionalHealth', Header: t('items.headers.additionalHealth'), accessor: d => d.additionalHealth },
  // { id: 'temperatureTolerance', Header: t('items.headers.temperatureTolerance'), accessor: d => d.temperatureTolerance },
  // { id: 'additionalDamage', Header: t('items.headers.additionalDamage'), accessor: d => d.additionalDamage },
  // { id: 'duration', Header: t('items.headers.duration'), accessor: d => d.duration },
];

const ItemsListView: React.ComponentType<Props> = ({ queryChanged }) => {
  const { t, lang } = useI18n();
  const columns = React.useMemo<Array<Column<Item>>>(() => columnsFactory(t, lang), [ lang ]);
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
      <ItemsTable
        tableProps={ getTableProps() }
        tableBodyProps={ getTableBodyProps() }
        data={ rows }
        prepareRow={ prepareRow }
        headerGroups={ headerGroups }
        sort={ sort }
        changeSort={ newSort => updateParams(newSort, page, pageSize) }
      />
      <ItemsPagination
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
