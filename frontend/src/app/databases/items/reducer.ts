import { State as I18nState } from '~/src/lib/i18n';
import { ItemsApi, Item } from '~/src/api';

import { defaultPaginateFunction, initReducer, ReducerState as BaseReducerState } from '../base/reducer';


export const reduxKey = 'items';
const { selectors, fetch, slice } = initReducer<Item>(
  'databases/items',
  reduxKey,
  ItemsApi.fetchAll,
  (item, field, t) => {
    if (field === 'name') {
      return t(`db.items.${ item.id }`);
    }
    return defaultPaginateFunction(item, field, t);
  }
);

export interface ReducerState extends BaseReducerState<Item> {}

export interface State extends I18nState {
  items: ReducerState;
}

export { selectors, fetch };
export const { changeParams, reset } = slice.actions;
export default slice.reducer;

