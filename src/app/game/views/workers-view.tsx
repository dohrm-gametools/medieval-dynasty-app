import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Modal, SemanticWIDTHS, Table } from 'semantic-ui-react';
import { useI18n } from '~/src/app/i18n';
import { Worker, WorkerCreationId } from '~/src/api';
import { saveWorker, deleteWorker, selectors } from '../reducer';
import { default as WorkerForm } from '../components/worker-form';

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

const WorkersView: React.ComponentType = () => {
  const dispatch = useDispatch()
  const game = useSelector(selectors.game);
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
        content={ item.id === '' ? '' : t(`app.game.worker.${ item.id }`) }
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
    dispatch(saveWorker({ game: game.id, worker }))
    setSelected(undefined);
  }
  const onEdit = (worker: Worker) => {
    setSelected(worker);
  }
  const onRemove = (worker: Worker) => {
    // TODO Add confirmation
    dispatch(deleteWorker({ game: game.id, worker: worker.id }))
  }

  return (
    <>
      <Table id="items-table" celled>
        <Table.Header>
          { columns.map((c, idx) => <Table.Row key={ `row-${ idx }` }>{ c.map(mapColumn) }</Table.Row>) }
        </Table.Header>
        <Table.Body>
          { game.workers.map((worker) => {
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
                <Table.Cell>{ t(`app.game.worker.sex.${ worker.sex }`) }</Table.Cell>
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

export default WorkersView;
