import * as React from 'react';
import { Alert, Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { Building, Production, TownBuilding, Worker } from '~/src/api';
import { With18nProps, withI18n } from '~/src/lib/i18n';
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
    }).slice(),
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

function computeProductionRate(building: TownBuilding): number {
  return building.productions.reduce((acc, c) => acc + c.percentage, 0);
}

interface CmpState {
  data: TownBuilding;
  availableWorkers: Array<WorkerOption>;
  productionRate: number;
  baseBuilding: Building;
  productionsById: { [ key: string ]: Production };
}

class BuildingForm extends React.Component<{
  building: TownBuilding,
  productions: Array<Production>,
  rawBuildings: { [ key: string ]: Building },
  workers: Array<Worker>,
  onSave: (updated: TownBuilding) => void,
  cancel: () => void,
} & With18nProps, CmpState> {

  componentDidMount() {
    // Initialize state
    this.setState({
      data: prepareState(this.props.building, this.props.rawBuildings[ this.props.building.buildingId ], this.props.productions),
      availableWorkers: filterWorkers(this.props.workers, this.props.building.assignedWorker),
      productionRate: computeProductionRate(this.props.building),
      baseBuilding: this.props.rawBuildings[ this.props.building.buildingId ],
      productionsById: this.props.productions.reduce((acc, c) => ({ ...acc, [ c.id ]: c }), {})
    });
  }

  onChange = ({ name, value }: { name: string, value: any }) => {
    let newData: TownBuilding | undefined;
    if (name.indexOf('worker:') === 0) {
      const idx = parseInt(name.substring('worker:'.length));
      const assignedWorker = [ ...this.state.data.assignedWorker ];
      assignedWorker[ idx ] = value as string;
      newData = { ...this.state.data, assignedWorker };
    }
    if (name.indexOf('prod:') === 0) {
      const idx = parseInt(name.substring('prod:'.length));
      const productions = [ ...this.state.data.productions ];
      productions[ idx ] = { ...productions[ idx ], percentage: parseInt(value) };
      newData = { ...this.state.data, productions };
    }
    if (!!newData) {
      this.setState({
        data: newData,
        availableWorkers: filterWorkers(this.props.workers, newData.assignedWorker),
        productionRate: computeProductionRate(newData),
      })
    }
  };

  save = (data: TownBuilding, productionRate: number) => {
    if (productionRate <= 100) {
      this.props.onSave({
        ...data,
        assignedWorker: data.assignedWorker.filter(w => w !== EmptyWorker),
        productions: data.productions.filter(p => p.percentage > 0),
      })
    }
  };

  cancel = () => this.props.cancel();

  render() {
    if (!this.state) return null;
    const { t } = this.props;
    const { data: state, availableWorkers, productionRate, baseBuilding, productionsById } = this.state;
    return (
      <Modal show
             size="xl"
             onHide={ this.cancel }
             backdrop="static"
             keyboard={ false }>
        <Modal.Header>
          <Modal.Title>{ t('app.game.tabs.buildings') } ({ t(`db.buildings.${ baseBuilding.id }`) })</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            { splitArray(state.assignedWorker, 4).map((a, idx) => (
              <Row key={ `group-worker-${ idx }` }>
                { a.map(d => (
                  <Form.Group key={ `worker:${ d.originalIdx }` } as={ Col }>
                    <Form.Label>{ t('app.game.building.workers') + ` (${ d.originalIdx + 1 }/${ state.assignedWorker.length })` }</Form.Label>
                    <Form.Select
                      value={ d.data }
                      name={ `worker:${ d.originalIdx }` }
                      onChange={ (e) => this.onChange({ name: e.target.name, value: e.target.value }) }
                    >
                      { availableWorkers.map(w => <option key={ `worker:opt:${ d.originalIdx }:${ w.value }` } value={ w.value }>{ w.text }</option>) }
                    </Form.Select>
                  </Form.Group>
                )) }
              </Row>
            )) }
            { state.productions.length > 0 ? <h3>{ t(`app.game.building.productions`) } ({ productionRate }%)</h3> : null }
            {
              splitArray(state.productions, 2).map((a, idx) => (
                <Row key={ `group-prod-${ idx }` }>
                  { a.map(d => {
                    const prod = productionsById[ d.data.productionId ];
                    const recipe = prod.costs.map(c => `${ t(`db.items.${ c.id }`) } x ${ c.count }`).join(', ');
                    return (
                      <Form.Group key={ `prod-${ d.originalIdx }` }>
                        <Form.Label>
                          { `${ t(`db.items.${ prod.itemId }`) }${ prod.stack > 1 ? ` x ${ prod.stack }` : '' }` }
                          { <span style={ { textOverflow: 'ellipsis', overflow: 'hidden' } }>{ recipe }</span> }
                        </Form.Label>
                        <Form.Control
                          disabled={ prod.producedPerDay <= 0 }
                          type="number"
                          min={ 0 }
                          max={ 100 }
                          value={ d.data.percentage }
                          name={ `prod:${ d.originalIdx }` }
                          onChange={ e => this.onChange({ name: e.target.name, value: e.target.value }) }
                        />
                      </Form.Group>
                    )
                  }) }
                </Row>
              ))
            }
            {
              productionRate > 100 ? (
                <Alert variant="danger">
                  { t('app.game.building.validation.percent.content') }
                </Alert>
              ) : null
            }
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={ this.cancel }>{ t('cancel') }</Button>
          <Button variant="primary" onClick={ () => this.save(state, productionRate) }>{ t('save') }</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default withI18n(BuildingForm);
