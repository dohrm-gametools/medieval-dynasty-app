import * as React from 'react';
import { Drawer as MuiDrawer, DrawerProps as MuiDrawerProps, styled } from '@mui/material';

interface DrawerProps extends MuiDrawerProps {
  drawerWidth: number;
}

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open' && prop !== 'drawerWidth'
})<DrawerProps>(({ theme, open, drawerWidth }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.secondary.main : theme.palette.secondary.dark,
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      width: theme.spacing(7),
      [ theme.breakpoints.up('sm') ]: {
        width: theme.spacing(9),
      }
    })
  }
}));

export default Drawer;
