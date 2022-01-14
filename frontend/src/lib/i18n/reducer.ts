import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export type I18nMap = { [ lang: string ]: { [ key: string ]: string } };

const load = createAsyncThunk('i18n/load', (payload: { baseI18n: I18nMap, asyncI18nLoader?: () => Promise<I18nMap> }) => {
  if (!payload.asyncI18nLoader) {
    return Promise.resolve(payload.baseI18n);
  }
  return payload.asyncI18nLoader()
    .then(result => {
      return Object.keys(result).reduce((acc, c) => {
        return { ...acc, [ c ]: { ...(acc[ c ] || {}), ...result[ c ] } };
      }, payload.baseI18n);
    })
    .catch(_ => payload.baseI18n);
})

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
  translations: {},
}

const slice = createSlice({
  name: 'i18n',
  initialState,
  reducers: {
    setSelectedLang(state, action: PayloadAction<string>) {
      if (state.supportedLanguages.includes(action.payload)) {
        state.lang = action.payload;
        state.translations = { ...(state.asyncTranslations[ action.payload ] || {}) };
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
