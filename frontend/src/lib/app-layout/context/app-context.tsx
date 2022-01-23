import * as React from 'react';

export interface AppItems {
  Toolbar?: React.ComponentType,
  RightDrawer?: React.ComponentType,
}

const AppContext = React.createContext<AppItems & {
  load: (items: AppItems) => any;
}>({ load() {} });


function AppContextProvider(props: React.PropsWithChildren<{}>) {
  const [ state, setState ] = React.useState<AppItems>({});
  return <AppContext.Provider value={ { ...state, load: setState } }>{ props.children }</AppContext.Provider>
}

export { AppContextProvider, AppContext };
