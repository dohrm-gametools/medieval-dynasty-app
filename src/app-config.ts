import { configureStore } from '@reduxjs/toolkit';
import { reducer as i18nReducer, reduxKey as i18nReduxKey } from '~/src/app/i18n';
import { reducer as itemsReducer, reduxKey as itemsReduxKey } from '~/src/app/items';

export const appStore = configureStore({
  reducer: {
    [i18nReduxKey]: i18nReducer,
    [itemsReduxKey]: itemsReducer,
    // router: connectRouter(history) as Reducer<RouterState, AnyAction>
  },
  // middleware: [routerMiddleware(history)]
});
