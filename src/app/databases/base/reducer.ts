import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReducerState as I18nReducerState, reduxKey as i18nKey } from '~/src/app/i18n';
import { paginate } from '~/src/utils';


export interface ReducerState<Value> {
  loaded: boolean;
  items: Array<Value>;
  page: number;
  sort: string;
  pageSize: number;
}

export type ChangeParamsPayload<Value> = Omit<ReducerState<Value>, 'loaded' | 'items'>

export type WithI18n = { i18n: { [ lang: string ]: string } }

export function defaultPaginateFunction<Value extends WithI18n>(item: Value, field: string, lang: string): string {
  if (field === 'name') {
    return item.i18n[ lang ];
  }
  // @ts-ignore
  return item[ field ];
}

export function initReducer<Value extends WithI18n>(
  prefix: string,
  reduxKey: string,
  fetchAll: () => Promise<Array<Value>>,
  paginateFunction: (item: Value, field: string, lang: string) => string = defaultPaginateFunction
) {
  const fetch = createAsyncThunk(
    `${ prefix }/fetchItems`,
    (thunkAPI) => fetchAll()
  )

  const initialState: ReducerState<Value> = {
    loaded: false,
    items: [],
    page: 0,
    sort: '',
    pageSize: 20,
  }

  const slice = createSlice({
    name: prefix,
    initialState,
    reducers: {
      reset(state) {
        state.loaded = false;
        state.items = [];
        state.page = 0;
        state.sort = '';
        state.pageSize = 20;
      },
      changeParams(state, action: PayloadAction<ChangeParamsPayload<Value>>) {
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
        state.items = action.payload as any;
      })
    }
  });

  type State = { [ i18nKey ]: I18nReducerState; } &
    { [ key: string ]: ReducerState<Value>; }; // hack

  const selectors = {
    loaded(state: State) { return state[ reduxKey ].loaded },
    paginatedItems(state: State) {
      return paginate(state[ reduxKey ].items.slice(), { sort: state[ reduxKey ].sort, pageSize: state[ reduxKey ].pageSize, page: state[ reduxKey ].page },
        (item: Value, field) => paginateFunction(item, field, state.i18n.lang));
    },
    page(state: State) { return state[ reduxKey ].page; },
    pageSize(state: State) { return state[ reduxKey ].pageSize; },
    sort(state: State) { return state[ reduxKey ].sort; },
    totalCount(state: State) { return state[ reduxKey ].items.length; },
  }
  return { selectors, fetch, slice };
}
