import * as React from 'react';

import { default as BaseListView, Column } from '../../base/views/list-view'
import { changeParams, fetch, reduxKey, selectors, reset } from '../reducer';
import { useI18n } from '~/src/app/i18n';
import { Item } from '~/src/api';


const columnsFactory = (t: (key: string) => string, lang: string): Array<Column<Item>> => [
  { id: 'category', header: t('app.database.items.table.headers.category'), accessor: d => t(`app.items.category.${ d.category.valueOf() }`) },
  { id: 'name', header: t('app.database.items.table.headers.name'), accessor: d => t(`db.items.${ d.id }`) },
  { id: 'durability', header: t('app.database.items.table.headers.durability'), accessor: d => d.durability },
  { id: 'weight', header: t('app.database.items.table.headers.weight'), accessor: d => d.weight },
  { id: 'price', header: t('app.database.items.table.headers.price'), accessor: d => d.price }
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
