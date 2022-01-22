import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, InputAdornment, MenuItem, TextField } from '@mui/material';
import { GameIcon } from '~/src/app/main/components/game-icon';
import { Worker } from '~/src/api';
import { useI18n } from '~/src/lib/i18n';

function formReducer(state: Worker, action: { type: string, payload: any }): Worker {
  const isSkills = action.type.indexOf('skills.') === 0;
  if (isSkills) {
    return { ...state, skills: { ...state.skills, [ action.type.substring('skills.'.length) ]: action.payload } };
  }
  return { ...state, [ action.type ]: action.payload };
}

const WorkerForm: React.ComponentType<{ worker: Worker, onSave: (updated: Worker) => void, cancel: () => void }> =
  ({
     worker,
     onSave,
     cancel
   }) => {
    const { t } = useI18n();
    const [ state, dispatch ] = React.useReducer(formReducer, worker);

    return (
      <Dialog open maxWidth="md" fullWidth aria-labelledby="form-dialog" disableEscapeKeyDown disablePortal>
        <DialogTitle id="form-dialog">{ t('app.game.tabs.workers') }</DialogTitle>
        <DialogContent>
          <DialogContentText>&nbsp;</DialogContentText>
          <Grid container component="form" spacing={ 2 }>
            <Grid item xs={ 4 }>
              <TextField
                label={ t('app.game.worker.name') }
                sx={ { width: '100%' } }
                value={ state.name }
                onChange={ (e) => dispatch({ type: 'name', payload: e.target.value }) }
              />
            </Grid>
            <Grid item xs={ 4 }>
              <TextField
                label={ t('app.game.worker.age') }
                sx={ { width: '100%' } }
                type="number"
                value={ state.age }
                onChange={ (e) => dispatch({ type: 'age', payload: parseInt(e.target.value) }) }
              />
            </Grid>
            <Grid item xs={ 4 }>
              <TextField
                label={ t('app.game.worker.sex') }
                sx={ { width: '100%' } }
                value={ state.sex }
                select
                onChange={ (e) => dispatch({ type: 'sex', payload: e.target.value }) }
              >
                <MenuItem value="f">{ t('app.game.worker.sex.f') }</MenuItem>
                <MenuItem value="m">{ t('app.game.worker.sex.m') }</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={ 2 }>
              <TextField
                type="number"
                sx={ { width: '100%' } }
                value={ state.skills.extraction }
                onChange={ (e) => dispatch({ type: 'skills.extraction', payload: parseInt(e.target.value) }) }
                InputProps={ {
                  startAdornment: <InputAdornment position="start"><GameIcon path="/skills/extraction.png"/></InputAdornment>
                } }
              />
            </Grid>
            <Grid item xs={ 2 }>
              <TextField
                type="number"
                sx={ { width: '100%' } }
                value={ state.skills.hunting }
                onChange={ (e) => dispatch({ type: 'skills.hunting', payload: parseInt(e.target.value) }) }
                InputProps={ {
                  startAdornment: <InputAdornment position="start"><GameIcon path="/skills/hunting.png"/></InputAdornment>
                } }
              />
            </Grid>
            <Grid item xs={ 2 }>
              <TextField
                type="number"
                sx={ { width: '100%' } }
                value={ state.skills.farming }
                onChange={ (e) => dispatch({ type: 'skills.farming', payload: parseInt(e.target.value) }) }
                InputProps={ {
                  startAdornment: <InputAdornment position="start"><GameIcon path="/skills/farming.png"/></InputAdornment>
                } }
              />
            </Grid>
            <Grid item xs={ 2 }>
              <TextField
                type="number"
                sx={ { width: '100%' } }
                value={ state.skills.diplomacy }
                onChange={ (e) => dispatch({ type: 'skills.diplomacy', payload: parseInt(e.target.value) }) }
                InputProps={ {
                  startAdornment: <InputAdornment position="start"><GameIcon path="/skills/diplomacy.png"/></InputAdornment>
                } }
              />
            </Grid>
            <Grid item xs={ 2 }>
              <TextField
                type="number"
                sx={ { width: '100%' } }
                value={ state.skills.survival }
                onChange={ (e) => dispatch({ type: 'skills.survival', payload: parseInt(e.target.value) }) }
                InputProps={ {
                  startAdornment: <InputAdornment position="start"><GameIcon path="/skills/survival.png"/></InputAdornment>
                } }
              />
            </Grid>
            <Grid item xs={ 2 }>
              <TextField
                type="number"
                sx={ { width: '100%' } }
                value={ state.skills.crafting }
                onChange={ (e) => dispatch({ type: 'skills.crafting', payload: parseInt(e.target.value) }) }
                InputProps={ {
                  startAdornment: <InputAdornment position="start"><GameIcon path="/skills/production.png"/></InputAdornment>
                } }
              />
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
