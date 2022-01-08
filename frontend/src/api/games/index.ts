function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


export interface ProductionWithAssignment {
  productionId: string;
  percentage: number;
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

export interface GameDetails {
  id: string;
  workers: Array<Worker>;
  buildings: Array<TownBuilding>;
}
