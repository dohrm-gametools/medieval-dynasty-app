import * as React from 'react';
import { Grid, Menu, Sidebar, List, Header } from 'semantic-ui-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useI18n } from '~/src/app/i18n';

const routes = [ 'buildings', 'items', 'productions' ];

const DatabaseRootComponent: React.ComponentType<{ rootPath: string }> = ({ rootPath }) => {
  const { t } = useI18n();
  const { pathname } = useLocation();
  return (
    <>
      <Grid.Column width="3">
        <Menu vertical fluid tabular>
          { routes.map(route => (
            <Menu.Item
              key={ route }
              as={ Link }
              active={ pathname === `${ rootPath }/${ route }` }
              name={ t(`app.database.menu.${ route }.title`) }
              to={ `${ rootPath }/${ route }` }
            />
          )) }
        </Menu>
      </Grid.Column>
      <Grid.Column width="13">
        <Outlet/>
      </Grid.Column>
    </>
  )
}

export { DatabaseRootComponent };
