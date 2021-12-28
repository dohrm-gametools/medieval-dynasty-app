import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// App
import { appStore } from '~/src/app-config';
import { MainLayout } from '~/src/app/main/components'
import { ListView as ItemsView } from '~/src/app/items';

const Application = () => (
  <Provider store={appStore}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout menus={[{ key: 'items', link: "/items" }]}/>}>
          <Route path="items" element={<ItemsView/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
);

render(
  <Application/>,
  document.getElementById('root')
);
