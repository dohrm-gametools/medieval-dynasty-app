import { State as I18nState } from '~/src/app/i18n';
import { ProductionsApi, Production } from '~/src/api';

import { initReducer, ReducerState as BaseReducerState, defaultPaginateFunction } from '../base/reducer';

export function displayRecipe(item: Production, lang: string): string {
  return item.costs.map((c) => `${ c.i18n[ lang ] || c.id } x ${ c.count }`).join(', ');
}

export function displayProducedIn(item: Production, lang: string): string {
  return item.producedIn.map((c) => c.i18n[ lang ] || c.id).join(', ');
}

export const reduxKey = 'productions';
const { selectors, fetch, slice } = initReducer<Production>(
  'databases/productions',
  reduxKey,
  ProductionsApi.fetchAll,
  (item, field, lang) => {
    if (field === 'recipe') return displayRecipe(item, lang);
    else if (field === 'producedIn') return displayProducedIn(item, lang);
    return defaultPaginateFunction(item, field, lang);
  }
);

export interface ReducerState extends BaseReducerState<Production> {}

export interface State extends I18nState {
  items: ReducerState;
}

export { selectors, fetch };
export const { changeParams, reset } = slice.actions;
export default slice.reducer;

