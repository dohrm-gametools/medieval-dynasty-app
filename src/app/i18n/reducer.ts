import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { I18nApi } from '~/src/api';
import { default as fr } from './fr';
import { default as en } from './en';

const translations: { [ lang: string ]: { [ key: string ]: string } } = { fr, en };

const load = createAsyncThunk('i18n/load', () => I18nApi.load())

export interface ReducerState {
  loaded: boolean;
  lang: string;
  supportedLanguages: Array<string>;
  asyncTranslations: { [ lang: string ]: { [ key: string ]: string } },
  translations: { [ key: string ]: string },
}

const initialState: ReducerState = {
  loaded: false,
  lang: 'fr', // TODO Read locale storage to retrieve this information & accept-header
  supportedLanguages: [ 'fr', 'en' ],
  asyncTranslations: {},
  translations: fr,
}

const slice = createSlice({
  name: 'i18n',
  initialState,
  reducers: {
    setSelectedLang(state, action: PayloadAction<string>) {
      if (state.supportedLanguages.includes(action.payload)) {
        state.lang = action.payload;
        state.translations = { ...(translations[ action.payload ] || {}), ...(state.asyncTranslations[ action.payload ] || {}) };
      }
    }
  },
  extraReducers: builder => builder.addCase(load.fulfilled, (state, action) => {
    state.loaded = true;
    state.asyncTranslations = action.payload;
    state.translations = { ...state.translations, ...(action.payload[ state.lang ] || {}) }
  })
});

export interface State {
  i18n: ReducerState;
}

export const reduxKey = 'i18n';
export { load };
export const actions = slice.actions;
export default slice.reducer;
