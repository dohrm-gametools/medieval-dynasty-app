import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dropdown, Table } from 'semantic-ui-react';
import { Building, BuildingCreationId, Production, TownBuilding } from '~/src/api';
import { ColumnType, mapColumn, SortType } from '~/src/app/game/views/utils';
import { useI18n } from '~/src/app/i18n';
import { default as BuildingForm } from '../components/building-form'
import { deleteBuilding, getProductionLevel, saveBuilding, selectors } from '../reducer';
import { EnrichedGame, EnrichedTownBuilding } from '../services';
import { Kind } from '~/src/api/buildings';


const columns: Array<ColumnType> = [
  { id: 'category', width: '1' },
  { id: '', width: '1' },
  { id: 'name', width: '4' },
  { id: 'productionLevel', width: '2' },
  { id: 'workers', width: '2' },
  { id: 'productionRate', width: '2' },
  { id: 'tax', width: '2' },
];

function createDraft(buildingId: string): TownBuilding {
  return {
    id: BuildingCreationId,
    buildingId,
    assignedWorker: [],
    productions: [],
  }
}

type BuildingByCategory = { category: string, buildings: Array<EnrichedTownBuilding> };

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
    const [ sort, setSort ] = React.useState<SortType>(undefined);

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
        <Table celled>
          <Table.Header>
            <Table.Row>{ columns.map(v => mapColumn(v, 'app.game.building', t, sort, setSort)) }</Table.Row>
          </Table.Header>
          <Table.Body>
            { buildings.map(c => {
              return c.buildings.map((building, idx) => {
                return (
                  <Table.Row key={ building.id }>
                    { idx === 0 ? <Table.Cell rowSpan={ c.buildings.length + '' }>{ t(`app.buildings.category.${ c.category }`) }</Table.Cell> : null }
                    <Table.Cell>
                      <Button.Group>
                        <Button icon="edit" onClick={ () => onEdit(building) }/>
                        <Button icon="trash" onClick={ () => onRemove(building) }/>
                      </Button.Group>
                    </Table.Cell>
                    <Table.Cell>{ t(`db.buildings.${ building.buildingId }`) }</Table.Cell>
                    <Table.Cell>{ getProductionLevel(building.raw, building.assignedWorker, game) || '' }</Table.Cell>
                    <Table.Cell>{ `${ building.assignedWorker.length } / ${ (c.category === Kind.House ? building.raw.capacity : building.raw.worker) || 0 }` }</Table.Cell>
                    <Table.Cell>{ building.productions.reduce((acc, c) => acc + c.percentage, 0) }</Table.Cell>
                    <Table.Cell>{ building.tax }</Table.Cell>
                  </Table.Row>
                )

              })
            }) }
          </Table.Body>
        </Table>
        <Dropdown
          icon="add"
          button
          floating
          scrolling
          className="icon"
        >
          <Dropdown.Menu>
            { Object.keys(buildingOptions).map(category => (
              <>
                <Dropdown.Header key={ `header.${ category }` }>{ t(`app.buildings.category.${ category }`) }</Dropdown.Header>
                <Dropdown.Divider key={ `divider.${ category }` }/>
                {
                  buildingOptions[ category ].map(b => (
                    <Dropdown.Item key={ b.value } { ...b } onClick={ (e, { value }) => onAdd(value) }/>
                  ))
                }
              </>
            )) }
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
