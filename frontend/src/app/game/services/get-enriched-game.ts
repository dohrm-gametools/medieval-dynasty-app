import { Building, GameDetails, Season, TownBuilding, Worker } from '~/src/api';
import { Kind } from '~/src/api/buildings';

export interface EnrichedWorker extends Worker {}

export interface EnrichedTownBuilding extends TownBuilding {
  raw: Building;
  tax: number;
}

export interface EnrichedGame {
  id: string;
  year: number;
  season: Season;
  workers: Array<EnrichedWorker>;
  buildings: Array<EnrichedTownBuilding>;
}

export const categorySort = {
  [ Kind.House.valueOf() ]: 1,
  [ Kind.Extraction.valueOf() ]: 2,
  [ Kind.Hunting.valueOf() ]: 3,
  [ Kind.Production.valueOf() ]: 4,
  [ Kind.Farming.valueOf() ]: 5,
  [ Kind.AnimalHusbandry.valueOf() ]: 6,
  [ Kind.Storage.valueOf() ]: 7,
  [ Kind.Service.valueOf() ]: 8,
}

export function getTownLevel(nbBuilding: number): number {
  let townLevel = 0;
  if (nbBuilding > 1 && nbBuilding <= 5) {
    townLevel = 1;
  } else if (nbBuilding > 5 && nbBuilding <= 10) {
    townLevel = 2;
  } else if (nbBuilding > 10 && nbBuilding <= 15) {
    townLevel = 3;
  } else if (nbBuilding > 15 && nbBuilding <= 25) {
    townLevel = 4;
  } else if (nbBuilding > 25 && nbBuilding <= 25) {
    townLevel = 5;
  } else if (nbBuilding > 35 && nbBuilding <= 45) {
    townLevel = 6;
  } else if (nbBuilding > 45 && nbBuilding <= 55) {
    townLevel = 7;
  } else if (nbBuilding > 55) {
    townLevel = 8;
  }
  return townLevel;
}

function mapBuilding(townBuilding: TownBuilding, rawBuildings: Array<Building>, taxModifier: number): EnrichedTownBuilding | undefined {
  const rawBuilding = rawBuildings.find(b => b.id === townBuilding.buildingId);
  return !rawBuilding ? undefined : {
    ...townBuilding,
    raw: rawBuilding,
    tax: Math.max(Math.round(rawBuilding.tax * taxModifier * 100) / 100, 1)
  }
}

function mapWorker(worker: Worker, game: GameDetails, rawBuildings: Array<Building>): EnrichedWorker {
  return worker;
}

export function getEnrichedGame(game: GameDetails, rawBuildings: Array<Building>): EnrichedGame {
  const townLevel = getTownLevel(game.buildings.length)
  const taxModifier = townLevel * 0.125;
  return {
    id: game.id,
    year: game.year,
    season: game.season,
    workers: game.workers.map(w => mapWorker(w, game, rawBuildings)).sort((a, b) => a.name.toLowerCase() === b.name.toLowerCase() ? 0 : (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1)),
    buildings: game.buildings.reduce<Array<EnrichedTownBuilding>>((acc, b) => {
      const item = mapBuilding(b, rawBuildings, taxModifier);
      if (item) {
        return [ ...acc, item ]
      }
      return acc;
    }, []).sort((a, b) => {
      const cata = categorySort[ a.raw.category.valueOf() ] || 99;
      const catb = categorySort[ b.raw.category.valueOf() ] || 99;
      if (cata < catb) return -1;
      if (cata > catb) return 1;
      const na = rawBuildings.findIndex(v => v.id === a.buildingId);
      const nb = rawBuildings.findIndex(v => v.id === b.buildingId);
      if (na < nb) return -1;
      if (na > nb) return 1;
      if (a.alias && b.alias) {
        if (a.alias < b.alias) return -1;
        if (a.alias > b.alias) return 1;
        return 0;
      } else if (a.alias) {
        return 1;
      } else if (b.alias) {
        return -1;
      }
      return 0;
    }),
  }
}
