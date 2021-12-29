import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
// App
import { appStore } from '~/src/app-config';
import { MainLayout } from '~/src/app/main/components'
import { DatabaseRootComponent } from '~/src/app/databases/root'
import { ItemsListView } from '~/src/app/databases/items';
import { BuildingsListView } from '~/src/app/databases/buildings';

const Redirect: React.ComponentType<{ to: string }> = ({ to }) => {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate(to);
  })
  return null;
}

const Application = () => (
  <Provider store={ appStore }>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <MainLayout routes={ [
          { key: 'menu.database.title', path: '/databases' },
          { key: 'menu.games.title', path: '/games' },
        ] }/> }>
          <Route path="games" element={ <span>Work In Progress</span> }/>
          <Route path="databases" element={ <DatabaseRootComponent rootPath="/databases"/> }>
            <Route path="buildings" element={ <BuildingsListView/> }/>
            <Route path="items" element={ <ItemsListView/> }/>
            <Route index element={ <Redirect to="/databases/buildings"/> }/>
          </Route>
          <Route index element={ <Redirect to="/games"/> }/>
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
);

render(
  <Application/>,
  document.getElementById('root')
);