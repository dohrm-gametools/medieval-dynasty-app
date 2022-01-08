import * as React from 'react';

import { default as BaseListView, Column } from '../../base/views/list-view'
import { changeParams, displayProducedIn, displayRecipe, fetch, reduxKey, reset, selectors } from '../reducer';
import { useI18n } from '~/src/app/i18n';
import { Production } from '~/src/api';


const columnsFactory = (t: (key: string) => string, lang: string): Array<Column<Production>> => [
  { id: 'name', header: t('app.database.productions.table.headers.name'), accessor: d => t(`db.items.${ d.itemId }`) },
  { id: 'recipe', header: t('app.database.productions.table.headers.recipe'), accessor: d => displayRecipe(d, t) },
  { id: 'producedIn', header: t('app.database.productions.table.headers.producedIn'), accessor: d => displayProducedIn(d, t) },
];

const ProductionsListView: React.ComponentType = () => {
  const { t, lang } = useI18n();
  const columns = React.useMemo<Array<Column<Production>>>(() => columnsFactory(t, lang), [ lang ]);
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

export default ProductionsListView;
