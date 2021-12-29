import * as React from 'react';
import { Dropdown, Grid, Menu } from 'semantic-ui-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useI18n } from '~/src/app/i18n';


export interface Props {
  routes: Array<{ key: string, path: string }>;
}

export const MainLayout: React.ComponentType<Props> = ({ routes }) => {
  const { pathname } = useLocation();
  const { t, lang, setSelectedLang } = useI18n();
  return (
    <>
      <Menu fixed="top" fluid inverted>
        <Menu.Item as={ Link } header to="/">Medieval Dynasty</Menu.Item>
        { routes.map(r => <Menu.Item key={ r.key } active={ pathname.indexOf(r.path) === 0 } as={ Link } header to={ r.path }>{ t(r.key) }</Menu.Item>) }
        <Menu.Menu position="right">
          <Dropdown item text="Language">
            <Dropdown.Menu>
              <Dropdown.Item selected={ lang === 'fr' } onClick={ () => setSelectedLang('fr') }>FR</Dropdown.Item>
              <Dropdown.Item selected={ lang === 'en' } onClick={ () => setSelectedLang('en') }>EN</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
      <Grid padded>
        <Outlet/>
      </Grid>
    </>
  );
}
