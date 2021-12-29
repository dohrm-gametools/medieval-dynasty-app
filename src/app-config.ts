import { configureStore } from '@reduxjs/toolkit';
import { reducer as i18nReducer, reduxKey as i18nReduxKey } from '~/src/app/i18n';
import { reducer as itemsReducer, reduxKey as itemsReduxKey } from '~/src/app/databases/items';
import { reducer as buildingsReducer, reduxKey as buildingsReduxKey } from '~/src/app/databases/buildings';

export const appStore = configureStore({
  reducer: {
    [ i18nReduxKey ]: i18nReducer,
    [ itemsReduxKey ]: itemsReducer,
    [ buildingsReduxKey ]: buildingsReducer,
    // router: connectRouter(history) as Reducer<RouterState, AnyAction>
  },
  // middleware: [routerMiddleware(history)]
});
