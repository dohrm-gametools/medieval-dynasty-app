import * as React from 'react';
import { Button, Form, Grid, Header, Input, Message, Modal, Select } from 'semantic-ui-react';
import { Building, Production, TownBuilding, Worker } from '~/src/api';
import { useI18n } from '~/src/app/i18n';
import { Kind } from '~/src/api/buildings';

type WorkerOption = { key: string, text: string, value: string, disabled?: boolean };
type State = TownBuilding;

const EmptyWorker = '___';

function filterWorkers(allWorkers: Array<Worker>, selected: Array<string>): Array<WorkerOption> {
  return [
    { key: '', text: '', value: EmptyWorker },
    ...allWorkers.map(c => ({
      key: c.id,
      value: c.id,
      text: c.name,
      disabled: selected.indexOf(c.id) > -1
    }))
  ];
}

function formReducer(state: State, action: { type: string, payload: any }): State {
  if (action.type.indexOf('worker:') === 0) {
    const idx = parseInt(action.type.substring('worker:'.length));
    const assignedWorker = [ ...state.assignedWorker ];
    assignedWorker[ idx ] = action.payload as string;
    return { ...state, assignedWorker };
  }
  if (action.type.indexOf('prod:') === 0) {
    const idx = parseInt(action.type.substring('prod:'.length));
    const productions = [ ...state.productions ];
    productions[ idx ] = { ...productions[ idx ], percentage: parseInt(action.payload) };
    return { ...state, productions };
  }
  return state;
}

function prepareState(state: TownBuilding, building: Building, productions: Array<Production>): State {
  const maxLength = (building.category === Kind.House ? building.capacity : building.worker) || 0;
  const assignedWorker: Array<string> = [];
  for (let i = 0; i < maxLength; ++i) {
    if (state.assignedWorker.length > i) assignedWorker.push(state.assignedWorker[ i ]);
    else assignedWorker.push(EmptyWorker);
  }

  return {
    ...state,
    assignedWorker,
    productions: productions.filter(p => p.producedIn.indexOf(state.buildingId) > -1).map(p => {
      return {
        productionId: p.id,
        percentage: state.productions.find(sp => sp.productionId === p.id)?.percentage || 0,
      };
    }),
  };
}

function splitArray<T>(items: Array<T>, breakpoint: number): Array<Array<{ data: T, originalIdx: number }>> {
  const nbSection = Math.floor(items.length / breakpoint) + (items.length % breakpoint === 0 ? 0 : 1);
  const result: Array<Array<{ data: T, originalIdx: number }>> = new Array(nbSection);
  for (let i = 0; i < items.length; ++i) {
    const idx = Math.floor(i / breakpoint);
    if (!result[ idx ]) result[ idx ] = [];
    result[ idx ].push({ data: items[ i ], originalIdx: i });
  }
  return result;
}

const BuildingForm: React.ComponentType<{
  building: TownBuilding,
  productions: Array<Production>,
  rawBuildings: { [ key: string ]: Building },
  workers: Array<Worker>,
  onSave: (updated: TownBuilding) => void,
  cancel: () => void
}> =
  ({
     building,
     productions,
     rawBuildings,
     workers,
     cancel,
     onSave
   }) => {
    const { t } = useI18n();
    const baseBuilding = rawBuildings[ building.buildingId ];
    const productionById = productions.reduce<{ [ key: string ]: Production }>((acc, c) => ({ ...acc, [ c.id ]: c }), {});
    const [ state, dispatch ] = React.useReducer(formReducer, prepareState(building, baseBuilding, productions));
    const productionRate = state.productions.reduce((acc, c) => acc + c.percentage, 0);
    const availableWorkers = filterWorkers(workers, state.assignedWorker);
    const onChange = (e: any, { name, value }: { name: string, value: any }) => dispatch({ type: name, payload: value });
    const save = () => {
      if (productionRate <= 100) {
        const result = {
          ...state,
          productions: state.productions.filter(s => s.percentage > 0),
          assignedWorker: state.assignedWorker.filter(s => s !== EmptyWorker),
        };
        onSave(result);
      }
    };
    return (
      <Modal open
             onClose={ cancel }
             closeOnEscape={ false }
             closeOnDimmerClick={ false }>
        <Modal.Header>{ t('app.game.tabs.buildings') } ({ t(`db.buildings.${ baseBuilding.id }`) })</Modal.Header>
        <Modal.Content>
          <Form error={ productionRate > 100 }>
            { splitArray(state.assignedWorker, 4).map((a, idx) => (
              <Form.Group key={ `group-worker-${ idx }` }>
                { a.map(d => (
                  <Form.Field key={ `worker:${ d.originalIdx }` }
                              label={ t('app.game.building.workers') + ` (${ d.originalIdx + 1 }/${ state.assignedWorker.length })` }
                              control={ Select }
                              value={ d.data }
                              options={ availableWorkers }
                              name={ `worker:${ d.originalIdx }` }
                              onChange={ onChange }
                              width="4"
                  />
                )) }
              </Form.Group>
            )) }
            { state.productions.length > 0 ?
              <Header as="h3">{ t(`app.game.building.productions`) } ({ productionRate }%)</Header> : null }
            {
              splitArray(state.productions, 2).map((a, idx) => (
                <Form.Group key={ `group-prod-${ idx }` } inline>
                  { a.map(d => {
                    const prod = productionById[ d.data.productionId ];
                    const recipe = prod.costs.map(c => `${ t(`db.items.${ c.id }`) } x ${ c.count }`).join(', ');
                    return (
                      <Form.Field
                        as={ Grid }
                        key={ `prod-${ d.originalIdx }` }
                        label={
                          <Header as="label">
                            { `${ t(`db.items.${ prod.itemId }`) }${ prod.stack > 1 ? ` x ${ prod.stack }` : '' }` }
                            { <Header.Subheader as="span" style={ { textOverflow: 'ellipsis', overflow: 'hidden' } }>{ recipe }</Header.Subheader> }
                          </Header>
                        }
                        control={ Input }
                        type="number"
                        min={ 0 }
                        max={ 100 }
                        value={ d.data.percentage }
                        name={ `prod:${ d.originalIdx }` }
                        onChange={ onChange }
                        width="8"
                      />
                    )
                  }) }
                </Form.Group>
              ))
            }
            <Message
              error
              header={ t('app.game.building.validation.percent.header') }
              content={ t('app.game.building.validation.percent.content') }
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={ () => cancel() }>{ t('cancel') }</Button>
          <Button onClick={ save }>{ t('save') }</Button>
        </Modal.Actions>
      </Modal>
    );
  };

export default BuildingForm;
