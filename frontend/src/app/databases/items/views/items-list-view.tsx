import * as React from 'react';

import { default as BaseListView, Column } from '../../base/views/list-view'
import { changeParams, fetch, reduxKey, selectors, reset } from '../reducer';
import { useI18n } from '~/src/lib/i18n';
import { Item } from '~/src/api';


const asHeaderRow = (key: keyof Item, t: (key: string) => string): Column<Item> => (
  { id: key, header: t(`app.database.items.table.headers.${ key }`), accessor: d => d[ key ] }
)

const columnsFactory = (t: (key: string) => string, lang: string): Array<Column<Item>> => [
  { id: 'category', header: t('app.database.items.table.headers.category'), accessor: d => t(`app.items.category.${ d.category.valueOf() }`) },
  { id: 'name', header: t('app.database.items.table.headers.name'), accessor: d => t(`db.items.${ d.id }`) },
  asHeaderRow('durability', t),
  asHeaderRow('weight', t),
  asHeaderRow('price', t),
  // asHeaderRow('tool', t),
  // asHeaderRow('damage', t),
  // asHeaderRow('poisoning', t),
  // asHeaderRow('extraction', t),
  // asHeaderRow('heat', t),
  // asHeaderRow('cold', t),
  // asHeaderRow('weightLimit', t),
  // asHeaderRow('health', t),
  // asHeaderRow('stamina', t),
  // asHeaderRow('food', t),
  // asHeaderRow('water', t),
  // asHeaderRow('wood', t),
  // asHeaderRow('alcohol', t),
  // asHeaderRow('foodConsumption', t),
  // asHeaderRow('staminaConsumption', t),
  // asHeaderRow('waterConsumption', t),
  // asHeaderRow('additionalHealth', t),
  // asHeaderRow('additionalDamage', t),
  // asHeaderRow('temperatureTolerance', t),
  // asHeaderRow('duration', t),
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
