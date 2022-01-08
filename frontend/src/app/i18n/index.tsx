import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actions, State, load } from './reducer';
import { Dimmer, Loader } from 'semantic-ui-react';

export { actions, State, reduxKey, default as reducer, ReducerState } from './reducer';

export const I18nLoader: React.ComponentType = ({ children }) => {
  const dispatch = useDispatch();
  const loaded = useSelector((state: State) => state.i18n.loaded);
  React.useEffect(() => {
    if (!loaded) {
      dispatch(load())
    }
  }, [ loaded ])
  return (
    <>
      <Dimmer active={ !loaded }>
        <Loader content="Loading"/>
      </Dimmer>
      { loaded ? <>{ children }</> : null }
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
