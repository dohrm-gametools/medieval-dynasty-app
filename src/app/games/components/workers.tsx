import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form, Modal, SemanticWIDTHS, Table } from 'semantic-ui-react';
import { useI18n } from '~/src/app/i18n';
import { Worker, WorkerCreationId } from '~/src/api';
import { saveWorker, deleteWorker } from '../reducer';

type ColumnType = { id: string, rowSpan?: SemanticWIDTHS, colSpan?: SemanticWIDTHS, width?: SemanticWIDTHS }
const columns: Array<Array<ColumnType>> = [
  [
    { id: '', width: '1' },
    { id: 'name', width: '4' },
    { id: 'age', width: '2' },
    { id: 'sex', width: '2' },
    { id: 'extraction', width: '2' },
    { id: 'hunting', width: '2' },
    { id: 'farming', width: '2' },
    { id: 'diplomacy', width: '2' },
    { id: 'survival', width: '2' },
    { id: 'crafting', width: '2' },
  ],
]

function createDraft(): Worker {
  return {
    id: WorkerCreationId,
    name: '',
    age: 18,
    sex: 'f',
    skills: {
      extraction: 1,
      hunting: 1,
      farming: 1,
      diplomacy: 1,
      survival: 1,
      crafting: 1
    }
  }
}


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
      <Modal open
             onClose={ cancel }
             closeOnEscape={ false }
             closeOnDimmerClick={ false }>
        <Modal.Header>{ t('app.games.tabs.worker') }</Modal.Header>
        <Modal.Content>
          <Form onSubmit={ () => onSave(state) }>
            <Form.Group>
              <Form.Input
                type="text"
                label={ t('app.games.worker.name') }
                value={ state.name }
                onChange={ (e, { value }) => dispatch({ type: 'name', payload: value }) }
              />
              <Form.Input
                type="number"
                label={ t('app.games.worker.age') }
                value={ state.age }
                min={ 0 }
                onChange={ (e, { value }) => dispatch({ type: 'age', payload: parseInt(value) }) }
              />
              <Form.Select
                fluid
                label={ t('app.games.worker.sex') }
                value={ state.sex }
                options={ [
                  { value: 'f', text: t('app.games.worker.sex.f') },
                  { value: 'm', text: t('app.games.worker.sex.m') }
                ] }
                onChange={ (e, { value }) => dispatch({ type: 'sex', payload: value }) }
              />
            </Form.Group>
            <Form.Group>
              <Form.Input
                type="number"
                label={ t('app.games.worker.extraction') }
                value={ state.skills.extraction }
                min={ 1 }
                onChange={ (e, { value }) => dispatch({ type: 'skills.extraction', payload: parseInt(value) }) }
              />
              <Form.Input
                type="number"
                label={ t('app.games.worker.crafting') }
                value={ state.skills.crafting }
                min={ 1 }
                onChange={ (e, { value }) => dispatch({ type: 'skills.crafting', payload: parseInt(value) }) }
              />
              <Form.Input
                type="number"
                label={ t('app.games.worker.farming') }
                value={ state.skills.farming }
                min={ 1 }
                onChange={ (e, { value }) => dispatch({ type: 'skills.farming', payload: parseInt(value) }) }
              />
            </Form.Group>
            <Form.Group>
              <Form.Input
                type="number"
                label={ t('app.games.worker.hunting') }
                value={ state.skills.hunting }
                min={ 1 }
                onChange={ (e, { value }) => dispatch({ type: 'skills.hunting', payload: parseInt(value) }) }
              />
              <Form.Input
                type="number"
                label={ t('app.games.worker.diplomacy') }
                value={ state.skills.diplomacy }
                min={ 1 }
                onChange={ (e, { value }) => dispatch({ type: 'skills.diplomacy', payload: parseInt(value) }) }
              />
              <Form.Input
                type="number"
                label={ t('app.games.worker.survival') }
                value={ state.skills.survival }
                min={ 1 }
                onChange={ (e, { value }) => dispatch({ type: 'skills.survival', payload: parseInt(value) }) }
              />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={ () => cancel() }>{ t('cancel') }</Button>
          <Button onClick={ () => onSave(state) }>{ t('save') }</Button>
        </Modal.Actions>
      </Modal>
    )
  }

const WorkerList: React.ComponentType<{ workers: Array<Worker>; game: string }> = ({ workers, game }) => {
  const dispatch = useDispatch()
  const [ selected, setSelected ] = React.useState<Worker | undefined>()
  const { t } = useI18n();
  const [ sort, setSort ] = React.useState<{ id: string, direction: 'ascending' | 'descending' } | undefined>(undefined);

  const mapColumn = (item: ColumnType) => {
    const isSorted = sort && sort.id === item.id;
    const direction = isSorted ? sort.direction : undefined;
    const nextDirection = isSorted ? (direction === 'descending' ? undefined : 'ascending') : 'descending';
    return (
      <Table.HeaderCell
        key={ item.id }
        sorted={ direction }
        content={ item.id === '' ? '' : t(`app.games.worker.${ item.id }`) }
        rowSpan={ item.rowSpan }
        colSpan={ item.colSpan }
        width={ item.width }
        onClick={ () => setSort(nextDirection && { id: item.id, direction: nextDirection }) }
      />
    )
  }
  const onAdd = () => {
    if (!selected) {
      setSelected(createDraft());
    }
  }
  const onSave = (worker: Worker) => {
    dispatch(saveWorker({ game, worker }))
    setSelected(undefined);
  }
  const onEdit = (worker: Worker) => {
    setSelected(worker);
  }
  const onRemove = (worker: Worker) => {
    // TODO Add confirmation
    dispatch(deleteWorker({ game, worker: worker.id }))
  }

  return (
    <>
      <Table id="items-table" celled>
        <Table.Header>
          { columns.map((c, idx) => <Table.Row key={ `row-${ idx }` }>{ c.map(mapColumn) }</Table.Row>) }
        </Table.Header>
        <Table.Body>
          { workers.map((worker) => {
            return (
              <Table.Row key={ worker.id }>
                <Table.Cell>
                  <Button.Group>
                    <Button icon="edit" onClick={ () => onEdit(worker) }/>
                    <Button icon="trash" onClick={ () => onRemove(worker) }/>
                  </Button.Group>
                </Table.Cell>
                <Table.Cell>{ worker.name }</Table.Cell>
                <Table.Cell>{ worker.age }</Table.Cell>
                <Table.Cell>{ t(`app.games.worker.sex.${ worker.sex }`) }</Table.Cell>
                <Table.Cell>{ worker.skills.extraction }</Table.Cell>
                <Table.Cell>{ worker.skills.hunting }</Table.Cell>
                <Table.Cell>{ worker.skills.farming }</Table.Cell>
                <Table.Cell>{ worker.skills.diplomacy }</Table.Cell>
                <Table.Cell>{ worker.skills.survival }</Table.Cell>
                <Table.Cell>{ worker.skills.crafting }</Table.Cell>
              </Table.Row>
            )
          }) }
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.Cell colSpan="10">
              <Button icon="add" onClick={ onAdd }/>
            </Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table>
      { selected ? <WorkerForm worker={ selected } onSave={ onSave } cancel={ () => setSelected(undefined) }/> : null }
    </>
  );
}

export { WorkerList };
