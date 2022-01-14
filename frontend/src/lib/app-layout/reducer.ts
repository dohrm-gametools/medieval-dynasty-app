import * as React from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const reduxKey = 'app-page';

export interface ReducerState {
  secondaryNavigation: Array<{ key: string, path: string }>;
  toolbar: React.ReactNode;
}

const initialState: ReducerState = {
  secondaryNavigation: [],
  toolbar: null,
}

const slice = createSlice({
  name: reduxKey,
  initialState,
  reducers: {
    changePage(state, action: PayloadAction<{ toolbar?: React.ReactNode, secondaryNavigation?: Array<{ key: string, path: string }> }>) {
      state.toolbar = action.payload.toolbar;
      state.secondaryNavigation = action.payload.secondaryNavigation || [];
    },
  },
});

export interface State {
  [ reduxKey ]: ReducerState;
}

export const actions = slice.actions;
export const selectors = {
  secondaryNavigation(state: State) { return state[ reduxKey ].secondaryNavigation; },
  toolbar(state: State) { return state[ reduxKey ].toolbar; },
}
export default slice.reducer;
