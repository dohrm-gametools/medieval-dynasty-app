import * as React from 'react';
import { Button, Dimmer, Grid, Input, Loader, Menu } from 'semantic-ui-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { useI18n } from '~/src/app/i18n';
import { BuildingKind, GameDetails, TownBuilding } from '~/src/api';
import { cleanup, list, selectors } from '../reducer';
import { WorkerList } from '../components/workers';


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
  location: string;
  t: (key: string) => string;
}

class GameView extends React.Component<GameViewProps, { activeTab: string }> {
  state = { activeTab: 'worker' };
  componentDidMount() {
    this.props.dispatch(list());
  }
  componentWillUnmount() {
    this.props.dispatch(cleanup());
  }

  render() {
    const { t, listLoaded, loading, game } = this.props;
    const { activeTab } = this.state
    return (
      <>
        <Dimmer active={ !listLoaded || loading }>
          <Loader content="Loading"/>
        </Dimmer>
        <Grid.Column width="3">
          <Menu vertical fluid tabular>
            {/*<Menu.Item header>{ t('menu.game.title') }</Menu.Item>*/ }
            <Menu.Item name={ t('app.game.tabs.worker') } active={ activeTab === 'worker' } onClick={ () => this.setState({ activeTab: 'worker' }) }/>
          </Menu>
        </Grid.Column>
        <Grid.Column width="10">
          { activeTab === 'worker' ? <WorkerList game={ game.id } workers={ game.workers }/> : null }
        </Grid.Column>
        <Grid.Column width="3">
          TODO : Town bilan
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
                      location={ location.pathname }
                      dispatch={ dispatch }
                      history={ history }/>
  }
}

export default withAttributes(GameView);
