import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Grid, Drawer } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { SectionPageView } from '~/src/lib/app-layout';
import { Loader } from '~/src/lib/loader';
import SummaryView from './summary-view';
import { cleanup, list, selectors } from '../reducer';


const GameView: React.ComponentType = () => {
  const listLoaded = useSelector(selectors.listLoaded);
  return (
    <Loader loaded={ listLoaded }>
      <Box sx={ {
        flexGrow: 1,
        height: '100%',
        width: '100%',
      } }>
        <Grid height="100%" container spacing={ 2 }>
          <Grid style={ { height: '100%', minHeight: '300px' } } item xs={ 12 } sm={ 12 } md={ 9 }>
            <Outlet/>
          </Grid>
          <Grid item xs={ 12 } sm={ 12 } md={ 3 }>
            <SummaryView/>
          </Grid>
        </Grid>
      </Box>
    </Loader>
  )
};

const PageView: React.ComponentType = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(list());
    return () => {
      dispatch(cleanup());
    };
  })
  return (
    <SectionPageView>
      <GameView/>
    </SectionPageView>
  );
}

export default PageView;
