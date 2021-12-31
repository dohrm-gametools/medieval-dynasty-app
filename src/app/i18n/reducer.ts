import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { default as fr } from './fr';
import { default as en } from './en';

const translations: { [ lang: string ]: { [ key: string ]: string } } = { fr, en };

export interface ReducerState {
  lang: string;
  supportedLanguages: Array<string>;
  translations: { [ key: string ]: string },
}

const initialState: ReducerState = {
  lang: 'fr', // TODO Read locale storage to retrieve this information & accept-header
  supportedLanguages: [ 'fr', 'en' ],
  translations: fr,
}

const slice = createSlice({
  name: 'i18n',
  initialState,
  reducers: {
    setSelectedLang(state, action: PayloadAction<string>) {
      if (state.supportedLanguages.includes(action.payload)) {
        state.lang = action.payload;
        state.translations = translations[ action.payload ] || {};
      }
    }
  },
});

export interface State {
  i18n: ReducerState;
}

export const reduxKey = 'i18n';
export const actions = slice.actions;
export default slice.reducer;
