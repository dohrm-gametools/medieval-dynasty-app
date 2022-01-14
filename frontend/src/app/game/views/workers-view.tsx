import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ButtonGroup, Button, Stack, Dropdown } from 'react-bootstrap';
import { ColumnDef, Table, createColumnDef, generateSortFunction } from '~/src/lib/table';
import { useI18n } from '~/src/lib/i18n';
import { Worker, WorkerCreationId } from '~/src/api';
import { deleteWorker, saveWorker, selectors } from '../reducer';
import { default as WorkerForm } from '../components/worker-form';
import { SearchableMenu } from '~/src/lib/searchable-menu';

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

const ButtonActions: React.ComponentType<{ worker: Worker, onEdit: (w: Worker) => any, onRemove: (w: Worker) => any }> = ({ worker, onEdit, onRemove }) => (
  <ButtonGroup>
    <Button variant="light" onClick={ () => onEdit(worker) }><i className="bi bi-pencil-square" aria-hidden="true"/></Button>
    <Button variant="light" onClick={ () => onRemove(worker) }><i className="bi bi-trash" aria-hidden="true"/></Button>
  </ButtonGroup>
)

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
    createColumnDef('', 5, prefix, t, false, w => <ButtonActions worker={ w } onEdit={ onEdit } onRemove={ onRemove }/>),
    createColumnDef('name', 20, prefix, t, true),
    createColumnDef('age', 10, prefix, t, true),
    createColumnDef('sex', 10, prefix, t, true, w => t(`app.game.worker.sex.${ w.sex }`)),
    createColumnDef('extraction', 10, prefix, t, true, w => w.skills.extraction),
    createColumnDef('hunting', 10, prefix, t, true, w => w.skills.hunting),
    createColumnDef('farming', 10, prefix, t, true, w => w.skills.farming),
    createColumnDef('diplomacy', 10, prefix, t, true, w => w.skills.diplomacy),
    createColumnDef('survival', 10, prefix, t, true, w => w.skills.survival),
    createColumnDef('crafting', 10, prefix, t, true, w => w.skills.crafting),
  ];

  const sortFunction = generateSortFunction(sort, columns);
  return (
    <>
      <Stack gap={ 3 }>
        <Table
          classNames="table striped hover bordered"
          columns={ columns }
          data={ [ ...game.workers ].sort(sortFunction) }
          sort={ sort }
          changeSort={ setSort }
        />
        <Dropdown as={ ButtonGroup }>
          <Dropdown.Toggle variant="outline-dark" size="sm" id="building-select-construct">
            <i className="bi bi-plus-circle" aria-hidden="true"/> Add
          </Dropdown.Toggle>
          <Dropdown.Menu as={ SearchableMenu }>
            <Dropdown.Header key={ `header.1` }>{ t(`app.buildings.category.1`) }</Dropdown.Header>
            <Dropdown.Header key={ `header.1` }>{ t(`app.buildings.category.2`) }</Dropdown.Header>
            <Dropdown.Header key={ `header.1` }>{ t(`app.buildings.category.3`) }</Dropdown.Header>
            <Dropdown.Header key={ `header.1` }>{ t(`app.buildings.category.3`) }</Dropdown.Header>
            <Dropdown.Header key={ `header.1` }>{ t(`app.buildings.category.3`) }</Dropdown.Header>
            <Dropdown.Header key={ `header.1` }>{ t(`app.buildings.category.3`) }</Dropdown.Header>
            <Dropdown.Header key={ `header.1` }>{ t(`app.buildings.category.3`) }</Dropdown.Header>
            <Dropdown.Header key={ `header.1` }>{ t(`app.buildings.category.3`) }</Dropdown.Header>
            <Dropdown.Header key={ `header.1` }>{ t(`app.buildings.category.3`) }</Dropdown.Header>
            <Dropdown.Header key={ `header.1` }>{ t(`app.buildings.category.3`) }</Dropdown.Header>
            <Dropdown.Header key={ `header.1` }>{ t(`app.buildings.category.3`) }</Dropdown.Header>
            <Dropdown.Header key={ `header.1` }>{ t(`app.buildings.category.3`) }</Dropdown.Header>
            <Dropdown.Header key={ `header.1` }>{ t(`app.buildings.category.3`) }</Dropdown.Header>
            <Dropdown.Header key={ `header.1` }>{ t(`app.buildings.category.3`) }</Dropdown.Header>
            <Dropdown.Header key={ `header.1` }>{ t(`app.buildings.category.3`) }</Dropdown.Header>
            <Dropdown.Header key={ `header.1` }>{ t(`app.buildings.category.3`) }</Dropdown.Header>
            <Dropdown.Header key={ `header.1` }>{ t(`app.buildings.category.3`) }</Dropdown.Header>
            <Dropdown.Header key={ `header.1` }>{ t(`app.buildings.category.3`) }</Dropdown.Header>
            <Dropdown.Header key={ `header.1` }>{ t(`app.buildings.category.3`) }</Dropdown.Header>
            <Dropdown.Header key={ `header.1` }>{ t(`app.buildings.category.3`) }</Dropdown.Header>
          </Dropdown.Menu>
        </Dropdown>
        <span>
          <Button variant="outline-dark" onClick={ onAdd } size="sm">
            <i className="bi bi-plus-circle" aria-hidden="true"/> Add
          </Button>
        </span>
      </Stack>
      { selected ? <WorkerForm worker={ selected } onSave={ onSave } cancel={ () => setSelected(undefined) }/> : null }
    </>
  );
}

export default WorkersView;
