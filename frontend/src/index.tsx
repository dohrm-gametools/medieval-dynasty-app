import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';

// App
import { appStore } from '~/src/app-config';
import { MainLayout } from '~/src/app/main/components'
import { I18nLoader } from '~/src/app/i18n';
import { BuildingsView, GameView, WorkersView } from '~/src/app/game';
import { Auth0Provider } from '@auth0/auth0-react';

import { DatabaseRootComponent } from '~/src/app/databases/root'
import { ItemsListView } from '~/src/app/databases/items';
import { BuildingsListView } from '~/src/app/databases/buildings';
import { ProductionsListView } from '~/src/app/databases/productions';

const Redirect: React.ComponentType<{ to: string }> = ({ to }) => {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate(to);
  })
  return null;
}

const Application = () => (
  <Provider store={ appStore }>
    <Auth0Provider domain="dohrm.eu.auth0.com" clientId="MKMfoFtjys1ZsB2i7wma9VwXqAwCv9oc" redirectUri={ window.location.origin }>
      <I18nLoader>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={ <MainLayout routes={ [
              { key: 'menu.game.title', path: '/game' },
              { key: 'menu.database.title', path: '/databases' },
            ] }/> }>
              <Route path="game" element={ <GameView rootPath="/game"/> }>
                <Route path="workers" element={ <WorkersView/> }/>
                <Route path="buildings" element={ <BuildingsView/> }/>
                <Route index element={ <Redirect to="/game/workers"/> }/>
              </Route>
              <Route path="databases" element={ <DatabaseRootComponent rootPath="/databases"/> }>
                <Route path="buildings" element={ <BuildingsListView/> }/>
                <Route path="items" element={ <ItemsListView/> }/>
                <Route path="productions" element={ <ProductionsListView/> }/>
                <Route index element={ <Redirect to="/databases/buildings"/> }/>
              </Route>
              <Route index element={ <Redirect to="/game"/> }/>
            </Route>
          </Routes>
        </BrowserRouter>
      </I18nLoader>
    </Auth0Provider>
  </Provider>
);

render(
  <Application/>,
  document.getElementById('root')
);
