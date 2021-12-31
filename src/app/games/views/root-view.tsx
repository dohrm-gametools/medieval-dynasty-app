import * as React from 'react';
import { Button, Dimmer, Grid, Input, Loader, Menu } from 'semantic-ui-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { useI18n } from '~/src/app/i18n';
import { GameDetails, GameInList } from '~/src/api';
import { cleanup, create, list, selectors } from '../reducer';

interface RootViewProps {
  rootPath: string;
  listLoaded: boolean;
  loading: boolean;
  games: Array<GameInList>;
  gameSelected?: GameDetails;
  dispatch: Dispatch<any>;
  location: string;
  t: (key: string) => string;
}

const CreateGameForm: React.ComponentType<{ submit: (name: string) => void }> = ({ submit }) => {
  const { t } = useI18n();
  const [ name, changeName ] = React.useState('');
  const onSubmit = () => {
    if (name.length > 0) {
      submit(name);
      changeName('');
    }
  }
  return (
    <Input type="text" placeholder={ t('app.games.menu.create-game-form.prompt') } action value={ name } onChange={ (e, { value }) => changeName(value) }>
      <input/>
      <Button type="submit" onClick={ onSubmit }>{ t('app.games.menu.create-game-form.button') }</Button>
    </Input>
  )
}

class RootView extends React.Component<RootViewProps, { addGameOpened: boolean }> {
  state = { addGameOpened: false };
  componentDidMount() {
    this.props.dispatch(list());
  }
  componentWillUnmount() {
    this.props.dispatch(cleanup());
  }

  createGame = (name: string) => {
    this.props.dispatch(create(name));
  }

  render() {
    return (
      <>
        <Dimmer active={ !this.props.listLoaded || this.props.loading }>
          <Loader content="Loading"/>
        </Dimmer>
        <Grid.Column width="3">
          <Menu text vertical>
            <Menu.Item header>{ this.props.t('menu.games.title') }</Menu.Item>
            { this.props.games.map(game => (
              <Menu.Item
                key={ game.id }
                as={ Link }
                active={ `${ this.props.rootPath }/${ game.id }` === this.props.location }
                name={ game.name }
                to={ `${ this.props.rootPath }/${ game.id }` }
              />
            )) }
            <Menu.Item>
              <CreateGameForm submit={ this.createGame }/>
            </Menu.Item>
          </Menu>
        </Grid.Column>
        <Grid.Column width="13">
          <Outlet/>
        </Grid.Column>
      </>
    );
  }
}

function withAttributes(Component: React.ComponentType<RootViewProps>): React.ComponentType<{ rootPath: string }> {
  return function ({ rootPath }) {
    const { t } = useI18n();
    const location = useLocation();
    const dispatch = useDispatch();
    const listLoaded = useSelector(selectors.listLoaded);
    const loading = useSelector(selectors.loading);
    const games = useSelector(selectors.games);
    const gameSelected = useSelector(selectors.gameSelected);

    return <Component t={ t }
                      rootPath={ rootPath }
                      listLoaded={ listLoaded }
                      loading={ loading }
                      games={ games }
                      location={ location.pathname }
                      dispatch={ dispatch }
                      gameSelected={ gameSelected }/>
  }
}

export default withAttributes(RootView);
