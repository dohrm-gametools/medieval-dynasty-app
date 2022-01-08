import * as React from 'react';

import { default as BaseListView, Column } from '../../base/views/list-view'
import { changeParams, fetch, reduxKey, selectors, reset } from '~/src/app/databases/buildings/reducer';
import { Building } from '~/src/api';
import { useI18n } from '~/src/app/i18n';

const columnsFactory = (t: (key: string) => string, lang: string): Array<Column<Building>> => [
  { id: 'category', header: t('app.database.buildings.table.headers.category'), accessor: d => t(`app.buildings.category.${ d.category.valueOf() }`) },
  { id: 'name', header: t('app.database.buildings.table.headers.name'), accessor: d => t(`db.buildings.${ d.id }`) },
  { id: 'tax', header: t('app.database.buildings.table.headers.tax'), accessor: d => d.tax },
  { id: 'storage', header: t('app.database.buildings.table.headers.storage'), accessor: d => d.storage },
  { id: 'worker', header: t('app.database.buildings.table.headers.worker'), accessor: d => d.worker },
  { id: 'worker', header: t('app.database.buildings.table.headers.capacity'), accessor: d => d.capacity },
];

const BuildingsListView: React.ComponentType = () => {
  const { t, lang } = useI18n();
  const columns = React.useMemo<Array<Column<Building>>>(() => columnsFactory(t, lang), [ lang ]);
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

export default BuildingsListView;
