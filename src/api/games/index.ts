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
  archived?: boolean;
  version?: string;
  workers: Array<Worker>;
  buildings: Array<TownBuilding>;
}

export const WorkerCreationId = 'MyAwesomeUserIsPendingForCreation ...';

export const GameDetailsDraft: GameDetails = {
  id: '',
  workers: [],
  buildings: [],
}

export module GameApi {
  const db = new PouchDB<GameDetails>('medieval-dynasty-planner');

  function fetchAll(): Promise<Array<GameDetails>> {
    return db.allDocs({ include_docs: true }).then(doc => doc.rows.reduce<Array<GameDetails>>((acc, c) => {
      if (c.doc) return [ ...acc, c.doc ];
      return acc;
    }, []))
  }

  export function list(): Promise<Array<GameDetails>> {
    return fetchAll().then(items => {
      const latest = items.find(game => !game.archived);
      if (!latest) {
        return create().then(item => [ item, ...items ]);
      }
      return Promise.resolve(items);
    });
  }

  export function one(id: string): Promise<GameDetails> {
    return db.get<GameDetails>(id).then((data) => data);
  }

  function create(): Promise<GameDetails> {
    const id = uuidv4();
    const docToInsert = { _id: id, id, workers: [], buildings: [] };
    return db.put<Omit<GameDetails, 'id'>>(docToInsert).then(_ => docToInsert);
  }

  export function archive(): Promise<Array<GameDetails>> {
    return fetchAll().then(items => {
      const latest = items.find(game => !game.archived);
      if (latest) {
        return db.put({ ...latest, archived: true }).then(list);
      }
      return list();
    });
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
