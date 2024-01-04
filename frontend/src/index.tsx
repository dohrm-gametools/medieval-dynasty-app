import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { createTheme, ThemeProvider } from '@mui/material'

// App
import { default as baseI18n } from './i18n';
import { I18nApi } from '~/src/api';
import { appStore } from '~/src/app-config';
import { I18nLoader } from '~/src/lib/i18n';
import { BuildingsView, GameView, ProductionsView, WorkersView } from '~/src/app/game';

import { GameIcon } from '~/src/app/main/components/game-icon';
import { DatabasesView } from '~/src/app/databases/root'
import { ItemsListView } from '~/src/app/databases/items';
import { BuildingsListView } from '~/src/app/databases/buildings';
import { ProductionsListView } from '~/src/app/databases/productions';
import { AuthLoader } from '~/src/app/login';
import { AppContextProvider, AppLayout } from '~/src/lib/app-layout';

const Redirect: React.ComponentType<{ to: string }> = ({ to }) => {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate(to);
  })
  return null;
}

// const Authenticated: React.ComponentType<{ Next: React.ComponentType<any>, [ key: string ]: any }> = ({ Next, ...others }) => {
//   const { pathname, search, state } = useLocation();
//   const { isAuthenticated, loginWithRedirect } = useAuth0();
//   if (!isAuthenticated) {
//     loginWithRedirect({ appState: { pathname, search, state } });
//     return null
//   }
//   return <Next { ...others }/>;
// }

const theme = createTheme({
  palette: {
    primary: {
      main: '#3d3426',
      dark: '#190d00',
      light: '#685d4e',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#d4c4ab',
      dark: '#fff7dd',
      light: '#a2947c',
      contrastText: '#000000',
    },
    // mode: 'dark',
  },
});

const Application = () => (
  <React.StrictMode>
    <Provider store={appStore}>
      <Auth0Provider domain="dohrm.eu.auth0.com" clientId="MKMfoFtjys1ZsB2i7wma9VwXqAwCv9oc" redirectUri={`${window.location.origin}/login`}>
        <AuthLoader>
          <I18nLoader baseI18n={baseI18n} asyncI18nLoader={I18nApi.load}>
            <ThemeProvider theme={theme}>
              <BrowserRouter>
                <AppContextProvider>
                  <AppLayout
                    title={'Medieval Dynasty'}
                    routes={[
                      {
                        key: 'menu.game.title', path: '/game', children: [
                          { key: 'app.game.tabs.workers', path: '/game/workers', icon: <GameIcon path="/workers.png"/> },
                          { key: 'app.game.tabs.buildings', path: '/game/buildings', icon: <GameIcon path="/buildings.png"/> },
                          { key: 'app.game.tabs.productions', path: '/game/productions', icon: <GameIcon path="/crafting.png"/> },
                        ]
                      },
                      {
                        key: 'menu.database.title', path: '/databases', children: [
                          { key: 'app.database.tabs.buildings', path: '/databases/buildings', icon: <GameIcon path="/buildings-db.png"/> },
                          { key: 'app.database.tabs.items', path: '/databases/items', icon: <GameIcon path="/inventory-db.png"/> },
                          { key: 'app.database.tabs.productions', path: '/databases/productions', icon: <GameIcon path="/production-db.png"/> },
                        ]
                      },
                    ]}>
                    <Routes>
                      <Route path="/" element={<Outlet/>}>
                        <Route path="game" element={<GameView/>}>
                          <Route path="workers" element={<WorkersView/>}/>
                          <Route path="buildings" element={<BuildingsView/>}/>
                          <Route path="productions" element={<ProductionsView/>}/>
                          <Route index element={<Redirect to="/game/workers"/>}/>
                        </Route>
                        <Route path="databases" element={<DatabasesView/>}>
                          <Route path="buildings" element={<BuildingsListView/>}/>
                          <Route path="items" element={<ItemsListView/>}/>
                          <Route path="productions" element={<ProductionsListView/>}/>
                          <Route index element={<Redirect to="/databases/buildings"/>}/>
                        </Route>
                        <Route index element={<Redirect to="/game"/>}/>
                      </Route>
                    </Routes>
                  </AppLayout>
                </AppContextProvider>
              </BrowserRouter>
            </ThemeProvider>
          </I18nLoader>
        </AuthLoader>
      </Auth0Provider>
    </Provider>
  </React.StrictMode>
);

render(
  <Application/>,
  document.getElementById('root')
);
