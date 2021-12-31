import * as React from 'react';
import { Tab } from 'semantic-ui-react';
import { GameDetails, TownBuilding } from '~/src/api';
import { WorkerList } from './workers';
import { Kind } from '~/src/api/buildings';
import { useI18n } from '~/src/app/i18n';


const TownDetails: React.ComponentType<{ game: GameDetails }> = ({ game }) => {
  const { t } = useI18n();
  const { houses, fieldsOrOrchard, others, storages } =
    game.buildings.reduce<{ houses: Array<TownBuilding>, fieldsOrOrchard: Array<TownBuilding>, others: Array<TownBuilding>, storages: Array<TownBuilding> }>(
      (acc, c) => {
        if (c.building.category === Kind.House) return { ...acc, houses: [ ...acc.houses, c ] };
        else if (c.building.category === Kind.Storage) return { ...acc, storages: [ ...acc.storages, c ] };
        else if (c.building.id === 'field' || c.building.id === 'orchard') return { ...acc, fieldsOrOrchard: [ ...acc.fieldsOrOrchard, c ] };
        else return { ...acc, others: [ ...acc.others, c ] };
      }, { houses: [], fieldsOrOrchard: [], others: [], storages: [] });
  return (
    <>
      <Tab panes={ [
        { menuItem: `${ t('app.games.tabs.worker') } (${ game.workers.length })`, render() { return <WorkerList game={ game.id } workers={ game.workers }/>} },
        { menuItem: `${ t('app.games.tabs.houses') } (${ houses.length })`, render() { return 'Houses'} },
        { menuItem: `${ t('app.games.tabs.fieldsOrOrchard') } (${ fieldsOrOrchard.length })`, render() { return 'fieldsOrOrchard'} },
        { menuItem: `${ t('app.games.tabs.productionOrExtraction') } (${ others.length })`, render() { return 'others'} },
        { menuItem: `${ t('app.games.tabs.storages') } (${ storages.length })`, render() { return 'storages'} },
      ] }/>
    </>
  );
}

export default TownDetails;
