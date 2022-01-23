import { configureStore } from '@reduxjs/toolkit';
import { reducer as loginReducer, reduxKey as loginReduxKey } from '~/src/app/login';
import { reducer as i18nReducer, reduxKey as i18nReduxKey } from '~/src/lib/i18n';
import { reducer as gamesReducer, reduxKey as gamesReduxKey } from '~/src/app/game';
import { reducer as itemsReducer, reduxKey as itemsReduxKey } from '~/src/app/databases/items';
import { reducer as buildingsReducer, reduxKey as buildingsReduxKey } from '~/src/app/databases/buildings';
import { reducer as productionsReducer, reduxKey as productionsReduxKey } from '~/src/app/databases/productions';

export const appStore = configureStore({
  reducer: {
    [ loginReduxKey ]: loginReducer,
    [ i18nReduxKey ]: i18nReducer,
    [ gamesReduxKey ]: gamesReducer,
    [ itemsReduxKey ]: itemsReducer,
    [ buildingsReduxKey ]: buildingsReducer,
    [ productionsReduxKey ]: productionsReducer,
    // router: connectRouter(history) as Reducer<RouterState, AnyAction>
  },
  // middleware: [routerMiddleware(history)]
});
