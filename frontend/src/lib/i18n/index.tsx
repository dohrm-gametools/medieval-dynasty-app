import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, I18nMap, load, State } from './reducer';

export { actions, State, reduxKey, default as reducer, ReducerState, I18nMap } from './reducer';

export const I18nLoader: React.ComponentType<{
  baseI18n: I18nMap,
  asyncI18nLoader: () => Promise<I18nMap>,
  LoaderComponent?: React.ComponentType,
}> = ({ baseI18n, asyncI18nLoader, LoaderComponent, children }) => {
  const dispatch = useDispatch();
  const loaded = useSelector((state: State) => state.i18n.loaded);
  React.useEffect(() => {
    if (!loaded) {
      dispatch(load({ baseI18n, asyncI18nLoader }))
    }
  }, [ loaded ])
  return (
    <>
      { loaded ? <>{ children }</> : (LoaderComponent ? <LoaderComponent/> : null) }
    </>
  )
}

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

export interface With18nProps {
  t: (key: string) => string;
  lang: string;
}

export function withI18n<Props = {}>(Component: React.ComponentType<Props & With18nProps>): React.ComponentType<Props> {
  return (props: Props) => {
    const { t, lang } = useI18n();
    return <Component t={ t } lang={ lang } { ...props }/>
  }
}
