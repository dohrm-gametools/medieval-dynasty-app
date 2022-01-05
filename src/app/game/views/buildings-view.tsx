import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Accordion, Button, Dropdown, Icon, Table } from 'semantic-ui-react';
import { Building, BuildingCreationId, Production, TownBuilding } from '~/src/api';
import { ColumnType, mapColumn, SortType } from '~/src/app/game/views/utils';
import { useI18n } from '~/src/app/i18n';
import { Kind } from '~/src/api/buildings';
import { default as BuildingForm } from '../components/building-form'
import { deleteBuilding, getProductionLevel, saveBuilding, selectors } from '../reducer';
import { EnrichedGame, EnrichedTownBuilding } from '../services';


const columns: Array<ColumnType> = [
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


const BuildingsSection: React.ComponentType<{
  sectionId: string,
  game: EnrichedGame,
  buildings: Array<EnrichedTownBuilding>,
  rawBuildings: { [ key: string ]: Building }
  productions: Array<Production>
}> =
  ({
     sectionId,
     game,
     buildings,
     rawBuildings,
     productions
   }) => {
    const dispatch = useDispatch();
    const { t } = useI18n();
    const [ opened, setOpened ] = React.useState(false);
    const [ selected, setSelected ] = React.useState<TownBuilding | undefined>()
    const [ sort, setSort ] = React.useState<SortType>(undefined);

    const onEdit = (b: TownBuilding) => {
      setSelected(b);
    }
    const onRemove = (b: TownBuilding) => {
      dispatch(deleteBuilding({ building: b.id }));
    }
    const onAdd = (buildingId: any) => {
      setSelected(createDraft(buildingId));
    }
    const onSave = (newBuilding: TownBuilding) => {
      dispatch(saveBuilding({ building: newBuilding }));
      setSelected(undefined);
    }

    return (
      <>
        <Accordion.Title active={ opened } onClick={ () => setOpened(!opened) }>
          <Icon name="dropdown"/>
          { t(`app.buildings.category.${ sectionId }`) }
        </Accordion.Title>
        <Accordion.Content active={ opened }>
          <Table celled>
            <Table.Header>
              <Table.Row>{ columns.map(v => mapColumn(v, 'app.game.building', t, sort, setSort)) }</Table.Row>
            </Table.Header>
            <Table.Body>
              { buildings.map(building => {
                const rawBuilding = rawBuildings[ building.buildingId ];
                const availableWorkers = rawBuilding && rawBuilding.category === Kind.House ? rawBuilding.capacity : rawBuilding?.worker;
                return (
                  <Table.Row key={ building.id }>
                    <Table.Cell>
                      <Button.Group>
                        <Button icon="edit" onClick={ () => onEdit(building) }/>
                        <Button icon="trash" onClick={ () => onRemove(building) }/>
                      </Button.Group>
                    </Table.Cell>
                    <Table.Cell>{ t(`db.buildings.${ building.buildingId }`) }</Table.Cell>
                    <Table.Cell>{ rawBuilding ? getProductionLevel(rawBuilding, building.assignedWorker, game) || '' : '' }</Table.Cell>
                    <Table.Cell>{ `${ building.assignedWorker.length } / ${ availableWorkers || 0 }` }</Table.Cell>
                    <Table.Cell>{ building.productions.reduce((acc, c) => acc + c.percentage, 0) }</Table.Cell>
                    <Table.Cell>{ building.tax }</Table.Cell>
                  </Table.Row>
                )
              }) }
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.Cell colSpan="10">
                  <Dropdown
                    icon="add"
                    floating
                    button
                    className="icon"

                  >
                    <Dropdown.Menu>
                      { Object
                        .values(rawBuildings)
                        .map(b => ({ id: b.id, label: t(`db.buildings.${ b.id }`) }))
                        .map(c => (
                            <Dropdown.Item
                              key={ c.id } value={ c.id } text={ c.label }
                              onClick={ (e, { value }) => onAdd(value) }
                            />
                          )
                        )
                      }
                    </Dropdown.Menu>
                  </Dropdown>
                </Table.Cell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </Accordion.Content>
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
  const reduceRaw = (kind: Kind) => (acc: { [ key: string ]: Building }, c: Building) => {
    if (c.category !== kind) return acc;
    return { ...acc, [ c.id ]: c };
  }
  const section = (kind: Kind) => {
    const b = Object.values(rawBuildings).reduce(reduceRaw(kind), {});
    return (
      <BuildingsSection
        sectionId={ kind.valueOf() }
        game={ game }
        buildings={ buildings[ kind.valueOf() ] }
        rawBuildings={ b }
        productions={ productions.filter(p => p.producedIn.findIndex(pi => !!b[ pi ]) >= 0) }
      />
    );
  }
  return (
    <Accordion>
      { section(Kind.House) }
      { section(Kind.Extraction) }
      { section(Kind.Hunting) }
      {/*{ section(Kind.Farming) }*/ }
      { section(Kind.AnimalHusbandry) }
      { section(Kind.Production) }
      {/*{ section(Kind.Service) }*/ }
      {/*{ section(Kind.Storage) }*/ }
    </Accordion>
  );
};

export default BuildingsView;
