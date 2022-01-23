import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, MenuItem, TextField } from '@mui/material';
import { UpdateGameDetails } from '~/src/api';
import { useI18n } from '~/src/lib/i18n';
import { SeasonField } from './season-field';

function formReducer(state: UpdateGameDetails, action: { type: string, payload: any }): UpdateGameDetails {
  return { ...state, [ action.type ]: action.payload };
}

const WorkerForm: React.ComponentType<{ data: UpdateGameDetails, onSave: (updated: UpdateGameDetails) => void, cancel: () => void }> =
  ({
     data,
     onSave,
     cancel
   }) => {
    const { t } = useI18n();
    const [ state, dispatch ] = React.useReducer(formReducer, data);

    return (
      <Dialog open maxWidth="md" fullWidth aria-labelledby="form-dialog" disableEscapeKeyDown disablePortal>
        <DialogTitle id="form-dialog">{ t('app.game.summary.details.title') }</DialogTitle>
        <DialogContent>
          <DialogContentText>&nbsp;</DialogContentText>
          <Grid container component="form" spacing={ 2 }>
            <Grid item xs={ 4 }>
              <TextField
                label={ t('app.game.summary.currentYear.title') }
                type="number"
                sx={ { width: '100%' } }
                value={ state.year }
                onChange={ (e) => dispatch({ type: 'year', payload: parseInt(e.target.value) }) }
              />
            </Grid>
            <Grid item xs={ 4 }>
              <SeasonField value={ state.season } onChange={ (payload) => dispatch({ type: 'season', payload }) } t={ t }/>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={ () => cancel() }>{ t('cancel') }</Button>
          <Button onClick={ () => onSave(state) }>{ t('save') }</Button>
        </DialogActions>
      </Dialog>
    )
  }

export default WorkerForm;
