import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { list, State } from './reducer';

export { State, reduxKey, default as reducer, MainState } from './reducer';

export { GameSelectorView } from './views/game-selector-view';

export const MainLoader: React.ComponentType<{}> = ({ children }) => {
  const dispatch = useDispatch();
  const loaded = useSelector((state: State) => state.main.loaded);
  React.useEffect(() => {
    if (!loaded) {
      dispatch(list());
    }
  }, [loaded]);
  return (
    <>
      {loaded ? <>{children}</> : null}
    </>
  )
}

export function useMain() {
  const { game, games } = useSelector((state: State) => state.main);
  return {
    gameId: game,
    games
  }
}

export interface WithGameId {
  gameId: string;
}

export function withGameId<Props = {}>(Component: React.ComponentType<Props & WithGameId>): React.ComponentType<Props> {
  return (props: Props) => {
    const { gameId } = useMain();
    return <Component gameId={gameId} {...props} />
  }
}
