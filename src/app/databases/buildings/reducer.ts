import { State as I18nState } from '~/src/app/i18n';
import { Building, BuildingsApi } from '~/src/api';

import { initReducer, ReducerState as BaseReducerState } from '../base/reducer';


export const reduxKey = 'buildings';
const { selectors, fetch, slice } = initReducer<Building>('databases/buildings', reduxKey, BuildingsApi.fetchAll);

export interface ReducerState extends BaseReducerState<Building> {}

export interface State extends I18nState {
  buildings: ReducerState;
}

export { selectors, fetch };
export const { changeParams, reset } = slice.actions;
export default slice.reducer;
