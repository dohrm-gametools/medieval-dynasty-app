import * as React from 'react';
import { Box, Container, CssBaseline, Divider, IconButton, ListSubheader, Toolbar, Typography } from '@mui/material';
import { ChevronLeft as ChevronLeftIcon, Menu as MenuIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import AppBar from '../components/app-bar';
import Drawer from '../components/drawer';
import Navigation, { Routes } from '../components/navigation';
import { AppContext } from '../context/app-context';

const drawerWidth = 240;

const AppLayout: React.ComponentType<{
  routes: Routes,
  title: string,
  icon?: string,
}> = props => {
  const { RightDrawer } = React.useContext(AppContext);
  const [ open, setOpen ] = React.useState(true);
  const [ openRight, setOpenRight ] = React.useState(false);
  const toggleDrawer = () => setOpen(!open);
  const toggleRightDrawer = () => setOpenRight(!openRight)

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
          { !!RightDrawer ?
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={ toggleRightDrawer }
              sx={ {
                marginLeft: '36px',
                ...(openRight && { display: 'none' }),
              } }>
              <MenuIcon/>
            </IconButton> : null }
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
      <Drawer variant="temporary" anchor="right" open={ openRight && !!RightDrawer } drawerWidth={ drawerWidth }>
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
          <IconButton onClick={ toggleRightDrawer } color="inherit">
            <ChevronRightIcon/>
          </IconButton>
        </Toolbar>
        <Divider/>
        { RightDrawer ? <RightDrawer/> : null }
      </Drawer>
    </Box>
  )
}

export default AppLayout;
