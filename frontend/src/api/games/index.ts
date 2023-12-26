export interface ProductionWithAssignment {
  productionId: string;
  productionValue: number;
}

export interface TownBuilding {
  id: string;
  buildingId: string;
  alias?: string;
  assignedWorker: Array<string>;
  productions: Array<ProductionWithAssignment>;
}

export interface Worker {
  id: string;
  name: string;
  age: number;
  sex: 'm' | 'f';
  skills: {
    extraction: number;
    hunting: number;
    farming: number;
    diplomacy: number;
    survival: number;
    crafting: number;
  };
}

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface GameDetails {
  id: string;
  season: Season;
  year: number;
  workers: Array<Worker>;
  buildings: Array<TownBuilding>;
}

export interface UpdateGameDetails {
  year?: number;
  season?: Season;
}
