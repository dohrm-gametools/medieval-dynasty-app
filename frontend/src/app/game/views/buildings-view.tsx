import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ButtonGroup, IconButton } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { ColumnDef, createColumnDef, generateSortFunction, Table } from '~/src/lib/table';
import { Building, BuildingCreationId, Production, TownBuilding } from '~/src/api';
import { useI18n } from '~/src/lib/i18n';
import { Dropdown, DropdownOptionGrouped } from '~/src/lib/dropdown';
import { Kind } from '~/src/api/buildings';
import SectionPageView from '~/src/lib/app-layout/view/section-page-view';
import { default as BuildingForm } from '../components/building-form'
import { deleteBuilding, getProductionLevel, saveBuilding, selectors, categorySort } from '../reducer';
import { EnrichedGame, EnrichedTownBuilding } from '../services';


function createDraft(buildingId: string): TownBuilding {
  return {
    id: BuildingCreationId,
    buildingId,
    assignedWorker: [],
    productions: [],
  }
}

type BuildingByCategory = { id: string, buildings: Array<EnrichedTownBuilding> };

const ButtonActions: React.ComponentType<{ building: TownBuilding, onEdit: (w: TownBuilding) => any, onRemove: (w: TownBuilding) => any }> =
  ({ building, onEdit, onRemove }) => (
    <ButtonGroup>
      <IconButton aria-label="edit" onClick={ () => onEdit(building) }><EditIcon/></IconButton>
      <IconButton aria-label="delete" onClick={ () => onRemove(building) }><DeleteIcon/></IconButton>
    </ButtonGroup>
  );

function buildOptions(buildings: { [ key: string ]: Building }, t: (key: string) => string): Array<DropdownOptionGrouped> {
  const result: { [ key: string ]: DropdownOptionGrouped } = {}
  Object.values(buildings).forEach(building => {
    const category = building.category.valueOf();
    if (!result[ category ]) {
      result[ category ] = { id: category, text: t(`app.buildings.category.${ category }`), options: [] }
    }
    result[ category ].options.push({
      id: building.id,
      text: t(`db.buildings.${ building.id }`),
    });

  })
  return Object.values(result).sort((a, b) => {
    const va = categorySort[ a.id ] || 99;
    const vb = categorySort[ b.id ] || 99;
    if (va < vb) return -1;
    if (va > vb) return 1;
    return 0;
  });
}

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
    const { t, lang } = useI18n();
    const [ selected, setSelected ] = React.useState<TownBuilding | undefined>()
    const [ sort, setSort ] = React.useState<string>('');
    const options = React.useMemo(() => buildOptions(rawBuildings, t), [ rawBuildings, lang ])

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
      createColumnDef('', 10, 'app.game.building', t, { render: c => <ButtonActions building={ c } onRemove={ onRemove } onEdit={ onEdit }/> }),
      createColumnDef('category', 10, 'app.game.building', t, { sortable: true, accessor: c => t(`app.buildings.category.${ c.raw.category }`) }),
      createColumnDef('name', 30, 'app.game.building', t, {
        sortable: true,
        accessor: c => `${ t(`db.buildings.${ c.buildingId }`) }${ c.alias && ' (' + c.alias + ')' || '' }`
      }),
      createColumnDef('productionLevel', 10, 'app.game.building', t, {
        sortable: true,
        accessor: c => getProductionLevel(c.raw, c.assignedWorker, game) || ''
      }),
      createColumnDef('workers', 10, 'app.game.building', t, {
        sortable: true,
        accessor: b => `${ b.assignedWorker.length } / ${ (b.raw.category === Kind.House ? b.raw.capacity : b.raw.worker) || 0 }`
      }),
      createColumnDef('productionRate', 10, 'app.game.building', t, { sortable: true, accessor: b => b.productions.reduce((acc, c) => acc + c.percentage, 0) }),
      createColumnDef('tax', 10, 'app.game.building', t, { sortable: true, accessor: c => c.tax }),
    ];
    const sortFunction = generateSortFunction(sort, columns);

    return (
      <>
        <Table<EnrichedTownBuilding>
          tableId="buildings"
          totalCount={ game.buildings.length }
          columns={ columns }
          data={ [ ...game.buildings ].sort(sortFunction) }
          sort={ sort }
          changeSort={ setSort }
          toolbar={
            <Dropdown text="add" options={ options } onChange={ onAdd } TriggerButton={ {
              variant: 'text',
              startIcon: <AddIcon/>,
              endIcon: null,
            } }/>
          }
        />
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
    return [ ...acc, { id: c, buildings: buildings[ c ] || [] } ]
  }, []);
  return (
    <SectionPageView>
      <BuildingsTable buildings={ groupedBuildings } game={ game } productions={ productions } rawBuildings={ rawBuildings }/>
    </SectionPageView>
  );
};

export default BuildingsView;
