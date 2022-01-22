import * as React from 'react';
import { Box, Container, CssBaseline, Divider, IconButton, ListSubheader, Toolbar, Typography } from '@mui/material';
import { ChevronLeft as ChevronLeftIcon, Menu as MenuIcon } from '@mui/icons-material';
import AppBar from '../components/app-bar';
import Drawer from '../components/drawer';
import Navigation, { Routes } from '../components/navigation';


const drawerWidth = 240;

const AppLayout: React.ComponentType<{
  routes: Routes,
  title: string,
  icon?: string,
}> = props => {
  const [ open, setOpen ] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  }

  return (
    <Box sx={ { display: 'flex' } }>
      <CssBaseline/>
      <AppBar position="absolute" open={ open } drawerWidth={ drawerWidth }>
        <Toolbar
          sx={ {
            pr: '24px', // keep right padding when drawer closed
          } }
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={ toggleDrawer }
            sx={ {
              marginRight: '36px',
              ...(open && { display: 'none' }),
            } }>
            <MenuIcon/>
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={ { flexGrow: 1 } }>
            { props.title }
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={ open } drawerWidth={ drawerWidth }>
        <Toolbar
          sx={ {
            backgroundColor: theme => theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.primary.dark,
            color: theme => theme.palette.primary.contrastText,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [ 1 ],
          } }
        >
          <IconButton onClick={ toggleDrawer } color="inherit">
            <ChevronLeftIcon/>
          </IconButton>
        </Toolbar>
        <Divider/>
        <Navigation routes={ props.routes }/>
      </Drawer>
      <Box
        component="main"
        sx={ {
          backgroundColor: theme => theme.palette.mode === 'light' ? theme.palette.secondary.main : theme.palette.secondary.dark,
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        } }>
        <Toolbar/>
        <Container style={ { height: 'calc(100% - 64px)', paddingTop: '20px', paddingBottom: '20px' } } maxWidth="xl"> {/* TODO Review that*/ }
          { props.children }
        </Container>
      </Box>
    </Box>
  )
}

export default AppLayout;
