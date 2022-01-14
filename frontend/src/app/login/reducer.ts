import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const reduxKey = 'login';

export interface ReducerState {
  logged: boolean;
}

const initialState: ReducerState = {
  logged: false,
}

const slice = createSlice({
  name: reduxKey,
  initialState,
  reducers: {},
});

export interface State {
  [ reduxKey ]: ReducerState;
}

export const actions = slice.actions;
export default slice.reducer;
