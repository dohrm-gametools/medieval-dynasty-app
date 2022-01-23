import * as React from 'react';
import { Season } from '~/src/api';
import { MenuItem, TextField } from '@mui/material';


export const SeasonField: React.ComponentType<{ value?: Season, onChange: (selected: Season) => any, t: (key: string) => string }> =
  ({
     value,
     onChange,
     t
   }) => (
    <TextField
      label={ t('app.game.summary.season.title') }
      sx={ { width: '100%' } }
      value={ value }
      select
      onChange={ (e) => onChange(e.target.value as Season) }
    >
      <MenuItem value="spring">{ t('db.seasons.spring') }</MenuItem>
      <MenuItem value="summer">{ t('db.seasons.summer') }</MenuItem>
      <MenuItem value="autumn">{ t('db.seasons.autumn') }</MenuItem>
      <MenuItem value="winter">{ t('db.seasons.winter') }</MenuItem>
    </TextField>
  );

