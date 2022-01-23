import * as React from 'react';
import { DailySummary, EnrichedGame } from '~/src/app/game/services';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow, TextField,
  Typography,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Season } from '~/src/api';
import { SeasonField } from '~/src/app/game/components/season-field';

export interface SummaryProps {
  game: EnrichedGame;
  summary: DailySummary;
  t: (key: string) => string;
  changeYear: (newYear: number) => any;
  changeSeason: (newSeason: Season) => any;
}

const GameDetails: React.ComponentType<{ game: EnrichedGame, summary: DailySummary, t: (key: string) => string, changeYear: (newYear: number) => any, changeSeason: (newSeason: Season) => any }> =
  ({ game, summary, t, changeYear, changeSeason }) => {
    return (
      <Grid container spacing={ 1 }>
        <Grid item xs={ 12 }>
          <TextField
            label={ t('app.game.summary.currentYear.title') }
            type="number"
            value={ game.year }
            sx={ { width: '100%' } }
            onChange={ e => changeYear(parseInt(e.currentTarget.value)) }
          />
        </Grid>
        <Grid item xs={ 12 }>
          <SeasonField value={ game.season } onChange={ changeSeason } t={ t }/>
        </Grid>
        <Grid item xs={ 12 }>
          <Typography>{ t('app.game.summary.tax.title') }: { summary.totalTax }</Typography>
        </Grid>
      </Grid>
    );
  }

const ConsumeDetails: React.ComponentType<{ summary: DailySummary, t: (key: string) => string }> = ({ summary, t }) => {
  return (
    <Table size="small" sx={ { width: '100%' } }>
      <TableHead>
        <TableRow>
          <TableCell variant="head" width="8"/>
          <TableCell variant="head" width="2">+</TableCell>
          <TableCell variant="head" width="2">-</TableCell>
          <TableCell variant="head" width="2"/>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>{ t(`app.game.summary.food.title`) }</TableCell>
          <TableCell>{ summary.others.food?.produced || 0 }</TableCell>
          <TableCell>{ summary.others.food?.consumed || 0 }</TableCell>
          <TableCell>{ summary.others.food?.balance || 0 }</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{ t(`app.game.summary.water.title`) }</TableCell>
          <TableCell>{ summary.others.water?.produced || 0 }</TableCell>
          <TableCell>{ summary.others.water?.consumed || 0 }</TableCell>
          <TableCell>{ summary.others.water?.balance || 0 }</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{ t(`app.game.summary.wood.title`) }</TableCell>
          <TableCell>{ summary.others.wood?.produced || 0 }</TableCell>
          <TableCell>{ summary.others.wood?.consumed || 0 }</TableCell>
          <TableCell>{ summary.others.wood?.balance || 0 }</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

const ProductionDetails: React.ComponentType<{ summary: DailySummary, t: (key: string) => string }> = ({ summary, t }) => {
  return (
    <Table size="small" sx={ { width: '100%' } }>
      <TableHead>
        <TableRow>
          <TableCell variant="head" width="8"/>
          <TableCell variant="head" width="2">+</TableCell>
          <TableCell variant="head" width="2">-</TableCell>
          <TableCell variant="head" width="2"/>
        </TableRow>
      </TableHead>
      <TableBody>
        { summary.productions.map(prod => (
          <TableRow key={ prod.id }>
            <TableCell>{ t(`db.items.${ prod.id }`) }</TableCell>
            <TableCell>{ prod.produced }</TableCell>
            <TableCell>{ prod.consumed }</TableCell>
            <TableCell>{ prod.balance }</TableCell>
          </TableRow>
        )) }
      </TableBody>
    </Table>
  );
}

const DurabilityDetails: React.ComponentType<{ summary: DailySummary, t: (key: string) => string }> = ({ summary, t }) => {
  return (
    <Table size="small" sx={ { width: '100%' } }>
      <TableHead>
        <TableRow>
          <TableCell variant="head" width="8"/>
          <TableCell variant="head" width="2">+</TableCell>
          <TableCell variant="head" width="2">-</TableCell>
          <TableCell variant="head" width="2"/>
        </TableRow>
      </TableHead>
      <TableBody>
        { summary.toolsDuration.map(prod => (
          <TableRow key={ prod.id }>
            <TableCell>{ t(`db.tools.${ prod.id }`) }</TableCell>
            <TableCell>{ prod.produced }</TableCell>
            <TableCell>{ prod.consumed }</TableCell>
            <TableCell>{ prod.balance }</TableCell>
          </TableRow>
        )) }
      </TableBody>
    </Table>
  );
}


export const AccordionView: React.ComponentType<SummaryProps & { opened?: boolean }> =
  ({
     game,
     summary,
     t,
     changeYear,
     opened,
     changeSeason,
   }) => (
    <React.Fragment>
      { /* game details */ }
      <Accordion defaultExpanded={ opened }>
        <AccordionSummary
          expandIcon={ <ExpandMoreIcon/> }
          aria-controls="panel-game-details-content"
          id="panel-game-details-header"
        >
          <Typography>{ t('app.game.summary.details.title') }</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <GameDetails game={ game } summary={ summary } t={ t } changeYear={ changeYear } changeSeason={ changeSeason }/>
        </AccordionDetails>
      </Accordion>
      { /* consume */ }
      <Accordion defaultExpanded={ opened }>
        <AccordionSummary
          expandIcon={ <ExpandMoreIcon/> }
          aria-controls="panel-consume-content"
          id="panel-consume-header"
        >
          <Typography>{ t('app.game.summary.consume.title') }</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ConsumeDetails summary={ summary } t={ t }/>
        </AccordionDetails>
      </Accordion>
      { /* product */ }
      <Accordion defaultExpanded={ opened }>
        <AccordionSummary
          expandIcon={ <ExpandMoreIcon/> }
          aria-controls="panel-product-content"
          id="panel-product-header"
        >
          <Typography>{ t('app.game.summary.product.title') }</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ProductionDetails summary={ summary } t={ t }/>
        </AccordionDetails>
      </Accordion>
      { /* durability */ }
      <Accordion defaultExpanded={ opened }>
        <AccordionSummary
          expandIcon={ <ExpandMoreIcon/> }
          aria-controls="panel-durability-content"
          id="panel-durability-header"
        >
          <Typography>{ t('app.game.summary.durability.title') }</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <DurabilityDetails summary={ summary } t={ t }/>
        </AccordionDetails>
      </Accordion>
    </React.Fragment>
  );

export const FullscreenView: React.ComponentType<SummaryProps & { onClose: () => any }> = ({ t, onClose, ...props }) => (
  <Dialog open maxWidth="lg" fullWidth aria-labelledby="summary-dialog" onClose={ onClose }>
    <DialogTitle>{ t('app.game.summary.title') }</DialogTitle>
    <DialogContent>
      <AccordionView t={ t } { ...props } opened/>
    </DialogContent>
    <DialogActions>
      <Button onClick={ onClose }>{ t('close') }</Button>
    </DialogActions>
  </Dialog>
)
