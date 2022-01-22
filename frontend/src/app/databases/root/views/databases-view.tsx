import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { SectionPageView } from '~/src/lib/app-layout';


const DatabasesView: React.ComponentType = () => (<Outlet/>);


const PageView: React.ComponentType = () => {
  return (
    <SectionPageView>
      <DatabasesView/>
    </SectionPageView>
  );
};

export default PageView;
