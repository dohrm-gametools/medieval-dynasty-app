import { BuildingsById, Kind } from '../buildings';
import { Productions } from '../productions';

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
  sex: 'h' | 'f';
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
  workers: Array<Worker>;
  buildings: Array<TownBuilding>;
}

export const WorkerCreationId = 'MyAwesomeUserIsPendingForCreation ...';
export const BuildingCreationId = 'MyAwesomeBuildingIsPendingForCreation ...';


export module GameApi {
  const key = 'medieval-dynasty-game';
  function read(): Promise<GameDetails> {
    let resStr = localStorage.getItem(key);
    let res = resStr ? JSON.parse(resStr) : undefined;
    if (!resStr) {
      res = {
        workers: [],
        buildings: [],
      };
      localStorage.setItem(key, JSON.stringify(res));
    }
    return Promise.resolve(res);
  }

  function save(details: GameDetails): Promise<GameDetails> {
    localStorage.setItem(key, JSON.stringify(details));
    return Promise.resolve(details);
  }

  export function one(): Promise<GameDetails> {
    return read();
  }

  export function createOrUpdateWorker(worker: Worker): Promise<GameDetails> {
    return read().then((data) => {
      if (worker.id === WorkerCreationId) {
        data.workers.push({ ...worker, id: uuidv4() });
      } else {
        const idx = data.workers.findIndex(w => w.id === worker.id);
        if (idx < 0) {
          data.workers.push(worker);
        } else {
          data.workers[ idx ] = worker;
        }
      }
      return save(data);
    });
  }

  export function deleteWorker(workerId: string): Promise<GameDetails> {
    return read().then((data) => {
      const idx = data.workers.findIndex(w => w.id === workerId);
      if (idx >= 0) {
        data.workers.splice(idx, 1);
      }
      // Remove worker from building.
      data.buildings.forEach(b => {
        const idx = b.assignedWorker.findIndex(c => c === workerId);
        if (idx >= 0) {
          b.assignedWorker.splice(idx, 1);
        }
      });
      return save(data);
    });
  }

  export function createOrUpdateBuilding(building: TownBuilding): Promise<GameDetails> {
    return read().then(data => {
      const rawBuilding = BuildingsById[ building.buildingId ];
      const allProductionsForBuilding = Productions.filter(p => p.producedIn.indexOf(building.buildingId) !== -1);
      // Cleanup workers in function of building capacity.
      if (rawBuilding.category === Kind.House) {
        if (building.assignedWorker.length > (rawBuilding.capacity || 0)) {
          building.assignedWorker = building.assignedWorker.slice(0, rawBuilding.capacity || 0);
        }
      } else {
        if (building.assignedWorker.length > (rawBuilding.worker || 0)) {
          building.assignedWorker = building.assignedWorker.slice(0, rawBuilding.worker || 0)
        }
      }
      // Cleanup other buildings
      building.assignedWorker.forEach(worker => {
        data.buildings.filter(b =>
          (rawBuilding.category === Kind.House ? BuildingsById[ b.buildingId ]?.category === Kind.House : BuildingsById[ b.buildingId ]?.category !== Kind.House)
        ).forEach(b => {
          b.assignedWorker = b.assignedWorker.filter(c => c !== worker);
        });
      });
      // Verify production objects.
      building.productions = building.productions.filter(prod => allProductionsForBuilding.findIndex(p => p.id === prod.productionId) > -1);
      // TODO Verify production rate

      if (building.id === BuildingCreationId) {
        data.buildings.push({ ...building, id: uuidv4() });
      } else {
        const idx = data.buildings.findIndex(b => b.id === building.id);
        if (idx < 0) {
          data.buildings.push(building);
        } else {
          data.buildings[ idx ] = building;
        }
      }
      return save(data);
    });
  }

  export function deleteBuilding(buildingId: string): Promise<GameDetails> {
    return read().then((data) => {
      const idx = data.buildings.findIndex(w => w.id === buildingId);
      if (idx >= 0) {
        data.buildings.splice(idx, 1);
      }
      return save(data);
    });
  }

}
