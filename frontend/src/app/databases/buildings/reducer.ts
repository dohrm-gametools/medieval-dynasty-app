import { State as I18nState } from '~/src/lib/i18n';
import { Building, BuildingsApi } from '~/src/api';

import { initReducer, ReducerState as BaseReducerState, defaultPaginateFunction } from '../base/reducer';


export const reduxKey = 'buildings';
const { selectors, fetch, slice } = initReducer<Building>(
  'databases/buildings',
  reduxKey,
  BuildingsApi.fetchAll,
  (item, field, t) => {
    if (field === 'name') {
      return t(`db.buildings.${ item.id }`);
    }
    return defaultPaginateFunction(item, field, t);
  }
);

export interface ReducerState extends BaseReducerState<Building> {}

export interface State extends I18nState {
  buildings: ReducerState;
}

export { selectors, fetch };
export const { changeParams, reset } = slice.actions;
export default slice.reducer;
