import * as React from 'react';
import { useI18n } from '~/src/lib/i18n';
import { Divider, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';

export type Routes = Array<{ key: string, path: string, children: Array<{ key: string, path: string, icon?: React.ReactNode, img?: string, imgClassName?: string }> }>;

export interface NavigationProps {
  routes: Routes;
}

const Navigation: React.ComponentType<NavigationProps> = ({ routes }) => {
  const { t } = useI18n();
  const { pathname } = useLocation()
  const navigate = useNavigate();
  return (
    <>
      { routes.map((route, idx) => (
        <React.Fragment key={ route.key }>
          <ListItem>
            <ListItemText inset primary={ t(route.key) }/>
          </ListItem>
          <Divider/>
          { route.children.map(child => (
            <ListItem key={ `item.${ route.key }.${ child.key }` } button onClick={ () => navigate(child.path) } selected={ pathname === child.path }>
              <ListItemIcon>{ child.icon ? child.icon : (child.img ?
                <img className={ child.imgClassName || '' } src={ child.img } width={ 32 } height={ 32 }/> : null) }</ListItemIcon>
              <ListItemText primary={ t(child.key) }/>
            </ListItem>
          )) }
          <Divider/>
        </React.Fragment>
      )) }
    </>
  );
}

export default Navigation;
