import * as React from 'react';
import { useI18n } from '~/src/app/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { GameDetails } from '~/src/api';
import { select, unselect, selectors } from '../reducer';
import { useParams } from 'react-router-dom';
import { Dispatch } from 'redux';
import { default as TownDetails } from '../components/town-details';
import { Grid } from 'semantic-ui-react';

interface GameViewProps {
  t: (key: string) => string;
  dispatch: Dispatch<any>;
  gameId: string;
  loading: boolean;
  game?: GameDetails;
}

class GameView extends React.Component<GameViewProps, {}> {
  componentDidMount() {
    this.props.dispatch(select(this.props.gameId));
  }
  componentWillUnmount() {
    this.props.dispatch(unselect());
  }

  render() {
    const { game, loading } = this.props;
    return (
      <Grid>
        <Grid.Column width="10">
          { !loading && !game ? <span>TODO manage error, game not exists</span> : (!loading && game ? <TownDetails game={ game }/> : null) }
        </Grid.Column>
        <Grid.Column width="6">
          TODO : Town bilan
        </Grid.Column>
      </Grid>
    );
  }
}

function withAttributes(Component: React.ComponentType<GameViewProps>): React.ComponentType<{}> {
  return function () {
    const { id } = useParams();
    const { t } = useI18n();
    const dispatch = useDispatch();
    const gameSelected = useSelector(selectors.gameSelected);
    const loading = useSelector(selectors.loading);
    return <Component t={ t } gameId={ id || '' } loading={ loading } game={ gameSelected } dispatch={ dispatch }/>
  }
}

export default withAttributes(GameView);
