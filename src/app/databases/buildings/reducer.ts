import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State as I18nState } from '~/src/app/i18n';
import { paginate } from '~/src/utils';
import { Building, BuildingsApi } from '~/src/api';

const fetch = createAsyncThunk(
  'databases/buildings/fetchItems',
  (thunkAPI) => BuildingsApi.fetchAll()
)

export type SortFields = keyof Building | `-${ keyof Building }` | 'name' | '-name' | '';

export interface ReducerState {
  loaded: boolean;
  items: Array<Building>;
  page: number;
  sort: SortFields;
  pageSize: number;
}

const initialState: ReducerState = {
  loaded: false,
  items: [],
  page: 0,
  sort: '',
  pageSize: 10,
}

const slice = createSlice({
  name: 'databases/buildings',
  initialState,
  reducers: {
    changeParams(state, action: PayloadAction<Omit<ReducerState, 'initialized' | 'loaded' | 'items'>>) {
      state.page = action.payload.page;
      state.pageSize = action.payload.pageSize;
      state.sort = action.payload.sort;
    },
  },
  extraReducers: builder => {
    builder
    .addCase(fetch.pending, (state) => {
      state.loaded = false;
    })
    .addCase(fetch.fulfilled, (state, action) => {
      state.loaded = true;
      state.items = action.payload;
    })
  }
})

export interface State extends I18nState {
  buildings: ReducerState;
}

export const selectors = {
  loaded(state: State) { return state.buildings.loaded },
  paginatedItems(state: State) {
    return paginate(state.buildings.items.slice(), { sort: state.buildings.sort, pageSize: state.buildings.pageSize, page: state.buildings.page },
      (item, field) => {
        if (field === 'name') {
          return item.i18n[ state.i18n.lang ];
        }
        // @ts-ignore
        return item[ field ];
      });
  },
  page(state: State) { return state.buildings.page; },
  pageSize(state: State) { return state.buildings.pageSize; },
  sort(state: State) { return state.buildings.sort; },
  totalCount(state: State) { return state.buildings.items.length; },
}
export { fetch };
export const { changeParams } = slice.actions;
export const reduxKey = 'buildings';
export default slice.reducer;
