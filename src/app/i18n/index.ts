import { useSelector, useDispatch } from 'react-redux';
import { actions, State } from './reducer';

export { actions, State, reduxKey, default as reducer, ReducerState } from './reducer';

export function useI18n() {
  const dispatch = useDispatch();
  const translations = useSelector((state: State) => state.i18n.translations);
  const lang = useSelector((state: State) => state.i18n.lang);
  const supportedLanguages = useSelector((state: State) => state.i18n.supportedLanguages);
  const setSelectedLang = (lang: string) => dispatch(actions.setSelectedLang(lang))
  const t = (key: string) => translations[ key ] || key;
  return {
    t,
    lang,
    supportedLanguages,
    setSelectedLang,
  };
}
