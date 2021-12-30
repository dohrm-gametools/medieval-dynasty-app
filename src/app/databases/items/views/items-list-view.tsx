import * as React from 'react';

import { default as BaseListView } from '../../base/views/list-view'
import { changeParams, fetch, reduxKey, selectors, reset } from '../reducer';
import { useI18n } from '~/src/app/i18n';
import { Column } from 'react-table';
import { Item } from '~/src/api';


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

const ItemsListView: React.ComponentType = () => {
  const { t, lang } = useI18n();
  const columns = React.useMemo<Array<Column<Item>>>(() => columnsFactory(t, lang), [ lang ]);
  return (
    <BaseListView
      reduxKey={ reduxKey }
      columns={ columns }
      paginatedItems={ selectors.paginatedItems }
      sort={ selectors.sort }
      page={ selectors.page }
      pageSize={ selectors.pageSize }
      totalCount={ selectors.totalCount }
      changeParams={ changeParams }
      fetch={ fetch }
      reset={ reset }
    />
  );
}

export default ItemsListView;
