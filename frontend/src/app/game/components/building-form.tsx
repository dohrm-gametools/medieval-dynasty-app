import * as React from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, MenuItem, TextField } from '@mui/material';
import { Building, Production, TownBuilding, Worker } from '~/src/api';
import { With18nProps, withI18n } from '~/src/lib/i18n';
import { Kind } from '~/src/api/buildings';

type WorkerOption = { key: string, text: string, value: string, disabled?: boolean };
type State = TownBuilding;

const EmptyWorker = '___';

function filterWorkers(allWorkers: Array<Worker>, selected: Array<string>): Array<WorkerOption> {
  return [
    { key: '', text: '-', value: EmptyWorker },
    ...allWorkers.map(c => ({
      key: c.id,
      value: c.id,
      text: c.name,
      disabled: selected.indexOf(c.id) > -1
    }))
  ];
}

function prepareState(state: TownBuilding, building: Building, productions: Array<Production>): State {
  const maxLength = (building.category === Kind.House ? building.capacity : building.worker) || 0;
  const assignedWorker: Array<string> = [];
  for (let i = 0; i < maxLength; ++i) {
    if (state.assignedWorker.length > i) assignedWorker.push(state.assignedWorker[i]);
    else assignedWorker.push(EmptyWorker);
  }

  return {
    ...state,
    assignedWorker,
    productions: productions.filter(p => p.producedIn.indexOf(state.buildingId) > -1).map(p => {
      return {
        productionId: p.id,
        productionValue: state.productions.find(sp => sp.productionId === p.id)?.productionValue || 0,
      };
    }).slice(),
  };
}

interface CmpState {
  data: TownBuilding;
  availableWorkers: Array<WorkerOption>;
  baseBuilding: Building;
  productionsById: { [key: string]: Production };
}

class BuildingForm extends React.Component<{
  building: TownBuilding,
  productions: Array<Production>,
  rawBuildings: { [key: string]: Building },
  workers: Array<Worker>,
  onSave: (updated: TownBuilding) => void,
  cancel: () => void,
} & With18nProps, CmpState> {

  componentDidMount() {
    // Initialize state
    this.setState({
      data: prepareState(this.props.building, this.props.rawBuildings[this.props.building.buildingId], this.props.productions),
      availableWorkers: filterWorkers(this.props.workers, this.props.building.assignedWorker),
      baseBuilding: this.props.rawBuildings[this.props.building.buildingId],
      productionsById: this.props.productions.reduce((acc, c) => ({ ...acc, [c.id]: c }), {})
    });
  }

  onChange = ({ name, value }: { name: string, value: any }) => {
    let newData: TownBuilding | undefined;
    if (name.indexOf('worker:') === 0) {
      const idx = parseInt(name.substring('worker:'.length));
      const assignedWorker = [...this.state.data.assignedWorker];
      assignedWorker[idx] = value as string;
      newData = { ...this.state.data, assignedWorker };
    } else if (name.indexOf('prod:') === 0) {
      const idx = parseInt(name.substring('prod:'.length));
      const productions = [...this.state.data.productions];
      productions[idx] = { ...productions[idx], productionValue: parseInt(value) };
      newData = { ...this.state.data, productions };
    } else {
      newData = { ...this.state.data, [name]: value };
    }

    if (!!newData) {
      this.setState({
        data: newData,
        availableWorkers: filterWorkers(this.props.workers, newData.assignedWorker),
      })
    }
  };

  save = (data: TownBuilding) => {
    this.props.onSave({
      ...data,
      assignedWorker: data.assignedWorker.filter(w => w !== EmptyWorker),
      productions: data.productions.filter(p => p.productionValue > 0),
    })
  };

  cancel = () => this.props.cancel();

  render() {
    if (!this.state) return null;
    const { t } = this.props;
    const { data: state, availableWorkers, baseBuilding, productionsById } = this.state;
    return (
      <Dialog open maxWidth="md" fullWidth aria-labelledby="form-dialog" disableEscapeKeyDown disablePortal>
        <DialogTitle id="form-dialog">{t('app.game.tabs.buildings')} ({t(`db.buildings.${baseBuilding.id}`)})</DialogTitle>
        <DialogContent>
          <DialogContentText>&nbsp;</DialogContentText>
          <Grid container component="form" spacing={2}>
            <Grid item xs={12}>
              <TextField
                value={state.alias || ''}
                name={`alias`}
                onChange={(e) => this.onChange({ name: e.target.name, value: e.target.value })}
                sx={{ width: '100%' }}
                label={t('app.game.building.alias')}
              />
            </Grid>
            {state.assignedWorker.map((d, idx) => (
              <Grid item key={`worker:${idx}`} xs={3}>
                <TextField
                  label={t('app.game.building.workers') + ` (${idx + 1}/${state.assignedWorker.length})`}
                  sx={{ width: '100%' }}
                  name={`worker:${idx}`}
                  value={d}
                  select
                  onChange={(e) => this.onChange({ name: e.target.name, value: e.target.value })}
                >
                  {availableWorkers.map(w => <MenuItem key={`worker:opt:${idx}:${w.value}`} value={w.value}>{w.text}</MenuItem>)}
                </TextField>
              </Grid>
            ))}
            {state.productions.length > 0 ? <Grid item xs={12}><h3>{t(`app.game.building.productions`)}</h3></Grid> : null}
            {state.productions.map((d, idx) => {
              const prod = productionsById[d.productionId];
              const recipe = prod.costs.map(c => `${t(`db.items.${c.id}`)} x ${c.count}`).join(', ');
              return (
                <Grid item key={`group-prod-${idx}`} xs={6}>
                  <TextField
                    key={`prod-${idx}`}
                    disabled={prod.producedPerDay <= 0}
                    type="number"
                    value={d.productionValue}
                    name={`prod:${idx}`}
                    onChange={(e) => this.onChange({ name: e.target.name, value: e.target.value })}
                    sx={{ width: '100%' }}
                    label={`${t(`db.items.${prod.itemId}`)}${prod.stack > 1 ? ` x ${prod.stack}` : ''}`}
                    helperText={recipe || ' '}
                  />
                </Grid>
              )
            })}
          </Grid>
          <DialogActions>
            <Button onClick={this.cancel}>{t('cancel')}</Button>
            <Button onClick={() => this.save(state)}>{t('save')}</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withI18n(BuildingForm);
