import * as React from 'react';
import { Grid, Menu, Sidebar } from 'semantic-ui-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useI18n } from '~/src/app/i18n';

const DatabaseRootComponent: React.ComponentType<{ rootPath: string }> = ({ rootPath }) => {
  const { t } = useI18n();
  const { pathname } = useLocation();
  return (
    <>
      <Grid.Column width="3">
        <Menu vertical borderless fixed="left" style={ { top: '44px' } } inverted>
          <Menu.Item>
            <Menu.Header>Databases</Menu.Header>
            <Menu.Menu>
              <Menu.Item active={ pathname === `${ rootPath }/buildings` } as={ Link } to={ `${ rootPath }/buildings` }>{ t('menu.database.buildings.title') }</Menu.Item>
              <Menu.Item active={ pathname === `${ rootPath }/items` } as={ Link } to={ `${ rootPath }/items` }>{ t('menu.database.items.title') }</Menu.Item>
              <Menu.Item active={ pathname === `${ rootPath }/productions` } as={ Link } to={ `${ rootPath }/productions` }>{ t('menu.database.productions.title') }</Menu.Item>
            </Menu.Menu>
          </Menu.Item>
        </Menu>
      </Grid.Column>
      <Grid.Column width="13">
        <Outlet/>
      </Grid.Column>
    </>
  )
}

export { DatabaseRootComponent };
