import { Building, Production } from '~/src/api';
import PouchDB from 'pouchdb';

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


export interface ProductionWithAssignment {
  product: Production;
  percentage: number;
}

export interface TownBuilding {
  building: Building;
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
  id: string;
  name: string;
  workers: Array<Worker>;
  buildings: Array<TownBuilding>;
}

export interface GameInList {
  id: string;
  name: string;
}

export const WorkerCreationId = 'MyAwesomeUserIsPendingForCreation ...';

export module GameApi {
  const db = new PouchDB<GameDetails>('medieval-dynasty-planner');

  export function list(): Promise<Array<GameInList>> {
    return db.allDocs({ include_docs: true }).then(doc => doc.rows.reduce<Array<GameInList>>((acc, c) => {
      if (c.doc) return [ ...acc, { id: c.doc.id, name: c.doc.name } ];
      return acc;
    }, []));
  }

  export function one(id: string): Promise<GameDetails> {
    return db.get<GameDetails>(id).then((data) => data);
  }

  export function create(name: string): Promise<GameDetails> {
    const id = uuidv4();
    const docToInsert = { _id: id, id, name, workers: [], buildings: [] };
    return db.put<Omit<GameDetails, 'id'>>(docToInsert).then(_ => docToInsert);
  }

  export function createOrUpdateWorker(id: string, worker: Worker): Promise<GameDetails> {
    return db.get<GameDetails>(id).then((data) => {
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
      return db.put(data).then(c => one(id));
    });
  }

  export function deleteWorker(id: string, workerId: string): Promise<GameDetails> {
    return db.get<GameDetails>(id).then((data) => {
      const idx = data.workers.findIndex(w => w.id === workerId);
      if (idx >= 0) {
        data.workers.splice(idx, 1);
      }
      return db.put(data).then(c => one(id));
    });
  }

  //
  // export function addBuilding(gameId: string, buildingId: string): Promise<Game> {
  //
  // }
}
