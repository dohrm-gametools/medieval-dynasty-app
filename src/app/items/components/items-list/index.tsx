import * as React from 'react';
import { Column } from 'react-table';
import { Item } from '~/src/api';
import { useI18n } from '~/src/app/i18n';

import { default as ItemListViewCmpBase } from './items-list-view';

export interface Props {
  items: Array<Item>;
  page: number;
  sort: string;
  pageSize: number;
  queryChanged: (page: number, sort: string, pageSize: number) => any;
}

const ItemsListViewCmp = ItemListViewCmpBase as React.ComponentType<{ columns: Array<Column<Item>> } | Props>;

const ItemsListView: React.ComponentType<Props> = (props) => {
  const { t, lang } = useI18n();
  const columns = React.useMemo<Array<Column<Item>>>(() => [
    { id: 'category', Header: t('items.headers.category'), accessor: d => t(`items.category.${ d.category.valueOf() }`) },
    { id: 'name', Header: t('items.headers.name'), accessor: d => d.i18n[ lang ] },
    { id: 'durability', Header: t('items.headers.durability'), accessor: d => d.durability },
    { id: 'weight', Header: t('items.headers.weight'), accessor: d => d.weight },
    { id: 'price', Header: t('items.headers.price'), accessor: d => d.price }
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
  ], [ lang ]);

  return <ItemsListViewCmp columns={ columns } { ...props }/>;
};

export default ItemsListView;
