import * as React from 'react';
import { Dimmer, Grid, Loader, Menu } from 'semantic-ui-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { useI18n } from '~/src/app/i18n';
import { BuildingKind, GameDetails, TownBuilding } from '~/src/api';
import { cleanup, list, selectors } from '../reducer';
import { default as SummaryView } from '../components/summary-view';


interface GameViewProps {
  rootPath: string;
  listLoaded: boolean;
  loading: boolean;
  game: GameDetails;
  history: Array<GameDetails>;
  houses: Array<TownBuilding>;
  productions: Array<TownBuilding>;
  hunting: Array<TownBuilding>;
  extractions: Array<TownBuilding>;
  farming: Array<TownBuilding>;
  dispatch: Dispatch<any>;
  pathname: string;
  t: (key: string) => string;
}

class GameView extends React.Component<GameViewProps, {}> {
  componentDidMount() {
    this.props.dispatch(list());
  }
  componentWillUnmount() {
    this.props.dispatch(cleanup());
  }

  render() {
    const { t, listLoaded, loading, rootPath, pathname } = this.props;
    return (
      <>
        <Dimmer active={ !listLoaded || loading }>
          <Loader content="Loading"/>
        </Dimmer>
        <Grid.Column width="3">
          <Menu vertical fluid tabular>
            <Menu.Item
              name={ t('app.game.tabs.workers') }
              as={ Link }
              active={ pathname === `${ rootPath }/workers` }
              to={ `${ rootPath }/workers` }
            />
            <Menu.Item
              name={ t('app.game.tabs.buildings') }
              as={ Link }
              active={ pathname === `${ rootPath }/buildings` }
              to={ `${ rootPath }/buildings` }
            />
          </Menu>
        </Grid.Column>
        <Grid.Column width="10">
          { listLoaded ? <Outlet/> : null }
        </Grid.Column>
        <Grid.Column width="3">
          <SummaryView/>
        </Grid.Column>
      </>
    );
  }
}

function withAttributes(Component: React.ComponentType<GameViewProps>): React.ComponentType<{ rootPath: string }> {
  return function ({ rootPath }) {
    const { t } = useI18n();
    const location = useLocation();
    const dispatch = useDispatch();
    const listLoaded = useSelector(selectors.listLoaded);
    const loading = useSelector(selectors.loading);
    const game = useSelector(selectors.game);
    const history = useSelector(selectors.history);
    const buildingsByCategory = useSelector(selectors.buildingsByCategory);

    return <Component t={ t }
                      rootPath={ rootPath }
                      listLoaded={ listLoaded }
                      loading={ loading }
                      game={ game }
                      houses={ buildingsByCategory[ BuildingKind.House.valueOf() ] }
                      productions={ buildingsByCategory[ BuildingKind.Production.valueOf() ] }
                      hunting={ buildingsByCategory[ BuildingKind.Hunting.valueOf() ] }
                      extractions={ buildingsByCategory[ BuildingKind.Extraction.valueOf() ] }
                      farming={ buildingsByCategory[ BuildingKind.Farming.valueOf() ] }
                      pathname={ location.pathname }
                      dispatch={ dispatch }
                      history={ history }/>
  }
}

export default withAttributes(GameView);
