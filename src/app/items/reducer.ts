import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

import { ItemsApi, Item } from '~/src/api';

const fetchItems = createAsyncThunk(
  'items/fetchItems',
  (thunkAPI) => ItemsApi.fetchAll()
)


export interface ReducerState {
  loaded: boolean;
  items: Array<Item>;
}

const initialState: ReducerState = {
  loaded: false,
  items: [],
}

const slice = createSlice({
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loaded = false;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loaded = true;
        state.items = action.payload;
      })
  }
})

export interface State {
  items: ReducerState;
}

export { fetchItems };
export const reduxKey = 'items';
export default slice.reducer;
