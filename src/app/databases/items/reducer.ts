import { State as I18nState } from '~/src/app/i18n';
import { ItemsApi, Item } from '~/src/api';

import { initReducer, ReducerState as BaseReducerState } from '../base/reducer';


export const reduxKey = 'items';
const { selectors, fetch, slice } = initReducer<Item>('databases/items', reduxKey, ItemsApi.fetchAll);

export interface ReducerState extends BaseReducerState<Item> {}

export interface State extends I18nState {
  items: ReducerState;
}

export { selectors, fetch };
export const { changeParams, reset } = slice.actions;
export default slice.reducer;

