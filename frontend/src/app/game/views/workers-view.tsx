import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup, IconButton } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { ColumnDef, createColumnDef, generateSortFunction, Table } from '~/src/lib/table';
import { useI18n } from '~/src/lib/i18n';
import { Worker, WorkerCreationId } from '~/src/api';
import { deleteWorker, saveWorker, selectors } from '../reducer';
import { default as WorkerForm } from '../components/worker-form';
import { GameIcon } from '~/src/app/main/components/game-icon';

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

const prefix = 'app.game.worker';

const ButtonActions: React.ComponentType<{ worker: Worker, onEdit: (w: Worker) => any, onRemove: (w: Worker) => any }> =
  ({ worker, onEdit, onRemove }) => (
    <ButtonGroup>
      <IconButton aria-label="edit" onClick={ () => onEdit(worker) }><EditIcon/></IconButton>
      <IconButton aria-label="delete" onClick={ () => onRemove(worker) }><DeleteIcon/></IconButton>
    </ButtonGroup>
  );

const WorkersView: React.ComponentType = () => {
  const dispatch = useDispatch()
  const { t } = useI18n();
  const game = useSelector(selectors.game);
  const [ selected, setSelected ] = React.useState<Worker | undefined>();
  const [ sort, setSort ] = React.useState<string>('');

  const onAdd = () => {
    if (!selected) {
      setSelected(createDraft());
    }
  }
  const onSave = (worker: Worker) => {
    dispatch(saveWorker({ id: game.id, worker }))
    setSelected(undefined);
  }
  const onEdit = (worker: Worker) => {
    setSelected(worker);
  }
  const onRemove = (worker: Worker) => {
    // TODO Add confirmation
    dispatch(deleteWorker({ id: game.id, worker: worker.id }))
  }

  const columns: Array<ColumnDef<Worker>> = [
    createColumnDef('', 10, prefix, t, { render: w => <ButtonActions worker={ w } onEdit={ onEdit } onRemove={ onRemove }/> }),
    createColumnDef('name', 62, prefix, t, { sortable: true }),
    createColumnDef('age', 5, prefix, t, { sortable: true }),
    createColumnDef('sex', 5, prefix, t, { sortable: true, accessor: w => t(`app.game.worker.sex.${ w.sex }`) }),
    createColumnDef('extraction', 3, prefix, t,
      {
        renderHeader: () => <GameIcon path="/skills/extraction.png"/>,
        sortable: true,
        accessor: w => w.skills.extraction,
        headerAlign: 'center',
        align: 'center',
      }),
    createColumnDef('hunting', 3, prefix, t,
      { renderHeader: () => <GameIcon path="/skills/hunting.png"/>, sortable: true, accessor: w => w.skills.hunting, headerAlign: 'center', align: 'center', }),
    createColumnDef('farming', 3, prefix, t,
      { renderHeader: () => <GameIcon path="/skills/farming.png"/>, sortable: true, accessor: w => w.skills.farming, headerAlign: 'center', align: 'center', }),
    createColumnDef('diplomacy', 3, prefix, t,
      {
        renderHeader: () => <GameIcon path="/skills/diplomacy.png"/>,
        sortable: true,
        accessor: w => w.skills.diplomacy,
        headerAlign: 'center',
        align: 'center',
      }),
    createColumnDef('survival', 3, prefix, t,
      {
        renderHeader: () => <GameIcon path="/skills/survival.png"/>,
        sortable: true,
        accessor: w => w.skills.survival,
        headerAlign: 'center',
        align: 'center',
      }),
    createColumnDef('crafting', 3, prefix, t,
      {
        renderHeader: () => <GameIcon path="/skills/production.png"/>,
        sortable: true,
        accessor: w => w.skills.crafting,
        headerAlign: 'center',
        align: 'center',
      }),
  ];

  const sortFunction = generateSortFunction(sort, columns);
  return (
    <>
      <Table<Worker>
        tableId="buildings"
        totalCount={ game.workers.length }
        columns={ columns }
        data={ [ ...game.workers ].sort(sortFunction) }
        sort={ sort }
        changeSort={ setSort }
        toolbar={
          <Button variant="text" onClick={ onAdd } startIcon={ <AddIcon/> }>
            Add
          </Button>
        }
      />
      { selected ? <WorkerForm worker={ selected } onSave={ onSave } cancel={ () => setSelected(undefined) }/> : null }
    </>
  );
}

export default WorkersView;
