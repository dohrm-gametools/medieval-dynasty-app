import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
// App
import { appStore } from '~/src/app-config';
import { MainLayout } from '~/src/app/main/components'
import { ItemsListView } from '~/src/app/items';

const Redirect: React.ComponentType<{ to: string }> = ({ to }) => {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate(to);
  })
  return null;
}

const Application = () => (
  <Provider store={appStore}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout menus={[{ key: 'items', link: "/items" }]}/>}>
          <Route path="items" element={<ItemsListView/>}/>
          <Route index element={<Redirect to="/items"/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
);

render(
  <Application/>,
  document.getElementById('root')
);
