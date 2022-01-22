import { Building, GameDetails, TownBuilding, Worker } from '~/src/api';

export interface EnrichedWorker extends Worker {}

export interface EnrichedTownBuilding extends TownBuilding {
  raw: Building;
  tax: number;
}

export interface EnrichedGame {
  id: string;
  workers: Array<EnrichedWorker>;
  buildings: Array<EnrichedTownBuilding>;
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
    workers: game.workers.map(w => mapWorker(w, game, rawBuildings)).sort((a, b) => a.name.toLowerCase() === b.name.toLowerCase() ? 0 : (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1)),
    buildings: game.buildings.reduce<Array<EnrichedTownBuilding>>((acc, b) => {
      const item = mapBuilding(b, rawBuildings, taxModifier);
      if (item) {
        return [ ...acc, item ]
      }
      return acc;
    }, []),
  }
}
