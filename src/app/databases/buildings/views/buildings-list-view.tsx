import * as React from 'react';

import { default as BaseListView } from '../../base/views/list-view'
import { changeParams, fetch, reduxKey, selectors, reset } from '~/src/app/databases/buildings/reducer';
import { Column } from 'react-table';
import { Building } from '~/src/api';
import { useI18n } from '~/src/app/i18n';

const columnsFactory = (t: (key: string) => string, lang: string): Array<Column<Building>> => [
  { id: 'category', Header: t('buildings.table.headers.category'), accessor: d => t(`buildings.category.${ d.category.valueOf() }`) },
  { id: 'name', Header: t('buildings.table.headers.name'), accessor: d => d.i18n[ lang ] },
  { id: 'tax', Header: t('buildings.table.headers.tax'), accessor: d => d.tax },
  { id: 'storage', Header: t('buildings.table.headers.storage'), accessor: d => d.storage },
  { id: 'worker', Header: t('buildings.table.headers.worker'), accessor: d => d.worker },
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
