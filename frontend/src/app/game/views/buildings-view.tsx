import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { ColumnDef, createColumnDef, generateSortFunction, Table } from '~/src/lib/table';
import { Building, BuildingCreationId, Production, TownBuilding } from '~/src/api';
import { useI18n } from '~/src/lib/i18n';
import { SearchableMenu } from '~/src/lib/searchable-menu';
import { default as BuildingForm } from '../components/building-form'
import { deleteBuilding, getProductionLevel, saveBuilding, selectors } from '../reducer';
import { EnrichedGame, EnrichedTownBuilding } from '../services';
import { Kind } from '~/src/api/buildings';


function createDraft(buildingId: string): TownBuilding {
  return {
    id: BuildingCreationId,
    buildingId,
    assignedWorker: [],
    productions: [],
  }
}

type BuildingByCategory = { category: string, buildings: Array<EnrichedTownBuilding> };

const ButtonActions: React.ComponentType<{ building: TownBuilding, onEdit: (w: TownBuilding) => any, onRemove: (w: TownBuilding) => any }> =
  ({ building, onEdit, onRemove }) => (
    <ButtonGroup>
      <Button variant="light" onClick={ () => onEdit(building) }><i className="bi bi-pencil-square" aria-hidden="true"/></Button>
      <Button variant="light" onClick={ () => onRemove(building) }><i className="bi bi-trash" aria-hidden="true"/></Button>
    </ButtonGroup>
  );

const BuildingsTable: React.ComponentType<{
  game: EnrichedGame,
  buildings: Array<BuildingByCategory>,
  rawBuildings: { [ key: string ]: Building },
  productions: Array<Production>
}> =
  ({
     game,
     buildings,
     rawBuildings,
     productions
   }) => {
    const dispatch = useDispatch();
    const { t } = useI18n();
    const [ selected, setSelected ] = React.useState<TownBuilding | undefined>()
    const [ sort, setSort ] = React.useState<string>('');

    const onEdit = (b: TownBuilding) => {
      setSelected(b);
    }
    const onRemove = (b: TownBuilding) => {
      dispatch(deleteBuilding({ id: game.id, building: b.id }));
    }
    const onAdd = (buildingId: any) => {
      setSelected(createDraft(buildingId));
    }
    const onSave = (newBuilding: TownBuilding) => {
      dispatch(saveBuilding({ id: game.id, building: newBuilding }));
      setSelected(undefined);
    }

    const columns: Array<ColumnDef<EnrichedTownBuilding>> = [
      createColumnDef('', 1, 'app.game.building', t, false, c => <ButtonActions building={ c } onRemove={ onRemove } onEdit={ onEdit }/>),
      createColumnDef('category', 1, 'app.game.building', t, true, c => t(`app.buildings.category.${ c.raw.category }`)),
      createColumnDef('name', 1, 'app.game.building', t, true, c => t(`db.buildings.${ c.buildingId }`)),
      createColumnDef('productionLevel', 1, 'app.game.building', t, true, c => getProductionLevel(c.raw, c.assignedWorker, game) || ''),
      createColumnDef('workers', 1, 'app.game.building', t, true, b => `${ b.assignedWorker.length } / ${ (b.raw.category === Kind.House ? b.raw.capacity : b.raw.worker) || 0 }`),
      createColumnDef('productionRate', 1, 'app.game.building', t, true, b => b.productions.reduce((acc, c) => acc + c.percentage, 0)),
      createColumnDef('tax', 1, 'app.game.building', t, true, c => c.tax),
    ];

    const sortFunction = generateSortFunction(sort, columns);

    const buildingOptions = Object.keys(rawBuildings).reduce<{ [ category: string ]: Array<{ text: string, value: string }> }>((acc, c) => {
      const current = rawBuildings[ c ];
      const category = current.category.valueOf();
      const id = current.id;
      const label = t(`db.buildings.${ id }`);
      if (!acc[ current.category.valueOf() ]) {
        return {
          ...acc,
          [ category ]: [ { text: label, value: id } ]
        }
      }
      return { ...acc, [ category ]: [ ...acc[ category ], { text: label, value: id } ] }
    }, {});

    return (
      <>
        <Table
          classNames="table striped hover bordered"
          columns={ columns }
          data={ [ ...game.buildings ].sort(sortFunction) }
          sort={ sort }
          changeSort={ setSort }
        />
        <Dropdown as={ ButtonGroup }>
          <Dropdown.Toggle variant="outline-dark" size="sm" id="building-select-construct">
            <i className="bi bi-plus-circle" aria-hidden="true"/> Add
          </Dropdown.Toggle>
          <Dropdown.Menu as={ SearchableMenu }>
            { Object.keys(buildingOptions).reduce<Array<React.ReactNode>>((acc, category) => ([
              ...acc,
              <Dropdown.Header key={ `header.${ category }` }>{ t(`app.buildings.category.${ category }`) }</Dropdown.Header>,
              ...buildingOptions[ category ].map(b => (
                <Dropdown.Item key={ `value.${ b.value }` } onClick={ () => onAdd(b.value) }>{ b.text }</Dropdown.Item>))
            ]), []) }
          </Dropdown.Menu>
        </Dropdown>
        { selected ? <BuildingForm
          building={ { ...selected } }
          productions={ productions.slice() }
          rawBuildings={ { ...rawBuildings } }
          workers={ game.workers.slice() }
          onSave={ onSave }
          cancel={ () => setSelected(undefined) }
        /> : null }
      </>
    );
  }

const BuildingsView: React.ComponentType = () => {
  const game = useSelector(selectors.game);
  const buildings = useSelector(selectors.buildingsByCategory);
  const rawBuildings = useSelector(selectors.rawBuildingById);
  const productions = useSelector(selectors.productions);
  const groupedBuildings = Object.keys(buildings).reduce<Array<BuildingByCategory>>((acc, c) => {
    return [ ...acc, { category: c, buildings: buildings[ c ] || [] } ]
  }, []);
  return (
    <BuildingsTable buildings={ groupedBuildings } game={ game } productions={ productions } rawBuildings={ rawBuildings }/>
  );
};

export default BuildingsView;
