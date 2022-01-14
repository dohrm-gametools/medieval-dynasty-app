import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { default as baseI18n } from './i18n';
import { I18nApi } from '~/src/api';

// App
import { appStore } from '~/src/app-config';
import { I18nLoader } from '~/src/lib/i18n';
import { BuildingsView, GameView, WorkersView } from '~/src/app/game';
import { Auth0Provider } from '@auth0/auth0-react';

import { DatabasesView } from '~/src/app/databases/root'
import { ItemsListView } from '~/src/app/databases/items';
import { BuildingsListView } from '~/src/app/databases/buildings';
import { ProductionsListView } from '~/src/app/databases/productions';
import { AuthLoader } from '~/src/app/login';
import { AppLayout } from '~/src/lib/app-layout';
// import './index.scss';

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

const Application = () => (
  <Provider store={ appStore }>
    <Auth0Provider domain="dohrm.eu.auth0.com" clientId="MKMfoFtjys1ZsB2i7wma9VwXqAwCv9oc" redirectUri={ `${ window.location.origin }/login` }>
      <AuthLoader>
        <I18nLoader baseI18n={ baseI18n } asyncI18nLoader={ I18nApi.load }>
          <BrowserRouter>
            <AppLayout
              title={ 'Medieval Dynasty' }
              routes={ [
                { key: 'menu.game.title', path: '/game' },
                { key: 'menu.database.title', path: '/databases' },
              ] }>
              <Routes>
                <Route path="/" element={ <Outlet/> }>
                  <Route path="game" element={ <GameView rootPath="/game"/> }>
                    <Route path="workers" element={ <WorkersView/> }/>
                    <Route path="buildings" element={ <BuildingsView/> }/>
                    <Route index element={ <Redirect to="/game/workers"/> }/>
                  </Route>
                  <Route path="databases" element={ <DatabasesView rootPath="/databases"/> }>
                    <Route path="buildings" element={ <BuildingsListView/> }/>
                    <Route path="items" element={ <ItemsListView/> }/>
                    <Route path="productions" element={ <ProductionsListView/> }/>
                    <Route index element={ <Redirect to="/databases/buildings"/> }/>
                  </Route>
                  <Route index element={ <Redirect to="/game"/> }/>
                </Route>
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </I18nLoader>
      </AuthLoader>
    </Auth0Provider>
  </Provider>
);

render(
  <Application/>,
  document.getElementById('root')
);
