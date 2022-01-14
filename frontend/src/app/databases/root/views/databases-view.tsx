import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { SectionPageView } from '~/src/lib/app-layout';


const DatabasesView: React.ComponentType = () => (<Outlet/>);


const routes = [ 'buildings', 'items', 'productions' ];

const PageView: React.ComponentType<{ rootPath: string }> = ({ rootPath }) => {
  return (
    <SectionPageView secondaryNavigation={ routes.map(r => ({ path: `${ rootPath }/${ r }`, key: `app.database.menu.${ r }.title` })) }>
      <DatabasesView/>
    </SectionPageView>
  );
};

export default PageView;
