import * as React from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const reduxKey = 'app-page';

export interface ReducerState {
  toolbar: React.ReactNode;
}

const initialState: ReducerState = {
  toolbar: null,
}

const slice = createSlice({
  name: reduxKey,
  initialState,
  reducers: {
    changePage(state, action: PayloadAction<{ toolbar?: React.ReactNode }>) {
      state.toolbar = action.payload.toolbar;
    },
  },
});

export interface State {
  [ reduxKey ]: ReducerState;
}

export const actions = slice.actions;
export const selectors = {
  toolbar(state: State) { return state[ reduxKey ].toolbar; },
}
export default slice.reducer;
