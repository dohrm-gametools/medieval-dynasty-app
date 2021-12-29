import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { State as I18nState } from '~/src/app/i18n';
import { paginate } from '~/src/utils';
import { ItemsApi, Item } from '~/src/api';

const fetch = createAsyncThunk(
  'databases/items/fetchItems',
  (thunkAPI) => ItemsApi.fetchAll()
)

export type SortFields = keyof Item | `-${ keyof Item }` | 'name' | '-name' | '';

export interface ReducerState {
  loaded: boolean;
  items: Array<Item>;
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
  name: 'databases/items',
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
  items: ReducerState;
}

export const selectors = {
  loaded(state: State) { return state.items.loaded },
  paginatedItems(state: State) {
    return paginate(state.items.items.slice(), { sort: state.items.sort, pageSize: state.items.pageSize, page: state.items.page },
      (item, field) => {
        if (field === 'name') {
          return item.i18n[ state.i18n.lang ];
        }
        // @ts-ignore
        return item[ field ];
      });
  },
  page(state: State) { return state.items.page; },
  pageSize(state: State) { return state.items.pageSize; },
  sort(state: State) { return state.items.sort; },
  totalCount(state: State) { return state.items.items.length; },
}
export { fetch };
export const { changeParams } = slice.actions;
export const reduxKey = 'items';
export default slice.reducer;
