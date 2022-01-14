import * as React from 'react';
import { useI18n } from '~/src/lib/i18n';
import { useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { selectors } from '~/src/lib/app-layout/reducer';
import { Tabs, Tab, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const SecondaryNavigation: React.ComponentType<{
  className?: string
}> = props => {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const routes = useSelector(selectors.secondaryNavigation);
  if (routes.length === 0) {
    return null;
  }
  const selectedRoute = routes.find(r => pathname.indexOf(r.path) === 0);
  return (
    <Nav variant="tabs" className={ props.className }>
      { routes.map(route => (
        <Nav.Link key={ route.key } as={ Link } to={ route.path } active={ selectedRoute === route }>{ t(route.key) } </Nav.Link>
      )) }
    </Nav>
  );
}

export default SecondaryNavigation;
