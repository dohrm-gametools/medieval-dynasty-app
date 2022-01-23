import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ButtonGroup, Card, CardContent, CardHeader, IconButton, } from '@mui/material';
import { Edit as EditIcon, Fullscreen as FullscreenIcon } from '@mui/icons-material';

import { selectors } from '~/src/app/game/reducer';
import { useI18n } from '~/src/lib/i18n';
import { Season, UpdateGameDetails } from '~/src/api';
import { updateGameDetails } from '../reducer';
import GameForm from '../components/game-form';
import { AccordionView, FullscreenView } from '../components/summary-details';


const Actions: React.ComponentType<{ openFullscreen: () => any }> = ({ openFullscreen }) => (
  <ButtonGroup>
    <IconButton onClick={ openFullscreen }><FullscreenIcon/></IconButton>
  </ButtonGroup>
)

const SummaryComponent: React.ComponentType = () => {
  const { t } = useI18n();
  const dispatch = useDispatch();
  const summary = useSelector(selectors.summary);
  const game = useSelector(selectors.game);
  const [ fullscreenOpen, setFullscreenOpen ] = React.useState(false);
  const handleChangeYear = (newYear: number) => {
    dispatch(updateGameDetails({ id: game.id, payload: { year: newYear } }));
  }
  const handleChangeSeason = (newSeason: Season) => {
    dispatch(updateGameDetails({ id: game.id, payload: { season: newSeason } }));
  }
  const openFullscreen = () => setFullscreenOpen(true);
  const closeFullscreen = () => setFullscreenOpen(false);
  return (
    <>
      <Card>
        <CardHeader title={ t('app.game.summary.title') } action={ <Actions openFullscreen={ openFullscreen }/> }/>
        <CardContent>
          <AccordionView summary={ summary } t={ t } game={ game } changeYear={ handleChangeYear } changeSeason={ handleChangeSeason }/>
        </CardContent>
      </Card>
      { fullscreenOpen ? (
        <FullscreenView
          game={ game }
          summary={ summary }
          t={ t }
          changeYear={ handleChangeYear }
          onClose={ closeFullscreen }
          changeSeason={ handleChangeSeason }/>
      ) : null }
    </>
  );
}

export default SummaryComponent;
