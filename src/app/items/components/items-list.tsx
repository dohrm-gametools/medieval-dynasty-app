import * as React from 'react';
import { Column } from 'react-table';
import { Item } from '~/src/api';
import { useI18n } from '~/src/app/i18n';
import { default as ItemTableBase } from './item-table';

const ItemTable = ItemTableBase as React.ComponentType<{ data: Array<Item>, columns: Array<Column<Item>> }>;

const ItemsList: React.ComponentType<{ items: Array<Item> }> = ({ items }) => {
  const { t, lang } = useI18n();
  const columns = React.useMemo<Array<Column<Item>>>(() => [
    { Header: t('items.headers.category'), accessor: d => t(`items.category.${d.category.valueOf()}`) },
    { Header: t('items.headers.name'), accessor: d => d.i18n[lang] },
    { Header: t('items.headers.durability'), accessor: d => d.durability },
    { Header: t('items.headers.weight'), accessor: d => d.weight },
    { Header: t('items.headers.price'), accessor: d => d.price },
    // { Header: t('items.headers.damage'), accessor: d => d.damage },
    // { Header: t('items.headers.poisoning'), accessor: d => d.poisoning },
    // { Header: t('items.headers.extraction'), accessor: d => d.extraction },
    // { Header: t('items.headers.heat'), accessor: d => d.heat },
    // { Header: t('items.headers.cold'), accessor: d => d.cold },
    // { Header: t('items.headers.weightLimit'), accessor: d => d.weightLimit },
    // { Header: t('items.headers.health'), accessor: d => d.health },
    // { Header: t('items.headers.stamina'), accessor: d => d.stamina },
    // { Header: t('items.headers.food'), accessor: d => d.food },
    // { Header: t('items.headers.water'), accessor: d => d.water },
    // { Header: t('items.headers.wood'), accessor: d => d.wood },
    // { Header: t('items.headers.alcohol'), accessor: d => d.alcohol },
    // { Header: t('items.headers.foodConsumption'), accessor: d => d.foodConsumption },
    // { Header: t('items.headers.waterConsumption'), accessor: d => d.waterConsumption },
    // { Header: t('items.headers.staminaConsumption'), accessor: d => d.staminaConsumption },
    // { Header: t('items.headers.additionalHealth'), accessor: d => d.additionalHealth },
    // { Header: t('items.headers.temperatureTolerance'), accessor: d => d.temperatureTolerance },
    // { Header: t('items.headers.additionalDamage'), accessor: d => d.additionalDamage },
    // { Header: t('items.headers.duration'), accessor: d => d.duration },
  ], [lang])

  return <ItemTable data={items} columns={columns}/>
};

export default ItemsList;
