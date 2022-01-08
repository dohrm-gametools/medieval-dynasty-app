import * as items from './items';
import * as buildings from './buildings';
import * as productions from './productions';
import { GameDetails, TownBuilding, Worker } from '~/src/api/games';

export { Building, Kind as BuildingKind } from './buildings';
export { Item, Kind as ItemKind } from './items'
export { Production } from './productions'
export * from './games';


function asModel<T>(response: Response): Promise<T> {
  if (response.status >= 400) {
    return Promise.reject(`[${ response.status }] error in api call`)
  }
  return response.json();
}

export module I18nApi {
  export function load(): Promise<{ [ lang: string ]: { [ key: string ]: string } }> {
    return fetch(`/api/i18n`).then(c => asModel<{ [ lang: string ]: { [ key: string ]: string } }>(c));
  }
}

export module ItemsApi {
  export function fetchAll(): Promise<Array<items.Item>> {
    return fetch(`/api/items`).then(c => asModel<{ data: Array<items.Item> }>(c)).then(v => v.data);
  }
}

export module BuildingsApi {
  export function fetchAll(): Promise<Array<buildings.Building>> {
    return fetch(`/api/buildings`).then(c => asModel<{ data: Array<buildings.Building> }>(c)).then(v => v.data);
  }
}

export module ProductionsApi {
  export function fetchAll(): Promise<Array<productions.Production>> {
    return fetch(`/api/productions`).then(c => asModel<{ data: Array<productions.Production> }>(c)).then(v => v.data);
  }
}

export const WorkerCreationId = 'MyAwesomeUserIsPendingForCreation ...';
export const BuildingCreationId = 'MyAwesomeBuildingIsPendingForCreation ...';

export module GameApi {
  const keyId = 'medieval-dynasty-game-id';

  function getId(): string | undefined {
    const id = localStorage.getItem(keyId);
    return !id || id === '' ? undefined : id;
  }

  function read(): Promise<GameDetails> {
    const id = getId();
    if (!id) {
      return create();
    }

    return fetch(`/api/games/${ id }`).then(c => {
      if (c.status === 404) return create();
      return asModel<GameDetails>(c);
    });
  }

  export function create(): Promise<GameDetails> {
    return fetch('/api/games', { method: 'POST' }).then(c => asModel<GameDetails>(c)).then(res => {
      localStorage.setItem(keyId, res.id);
      return res;
    });
  }

  export function one(): Promise<GameDetails> {
    return read();
  }

  export function createOrUpdateWorker(id: string, worker: Worker): Promise<GameDetails> {
    return fetch(`/api/games/${ id }/workers`, {
      method: 'PUT',
      body: JSON.stringify({ ...worker, id: (worker.id === WorkerCreationId ? '' : worker.id) })
    }).then(c => asModel<GameDetails>(c));
  }

  export function deleteWorker(id: string, workerId: string): Promise<GameDetails> {
    return fetch(`/api/games/${ id }/workers/${ workerId }`, { method: 'DELETE' }).then(c => asModel<GameDetails>(c));
  }

  export function createOrUpdateBuilding(id: string, building: TownBuilding): Promise<GameDetails> {
    return fetch(`/api/games/${ id }/buildings`, {
      method: 'PUT',
      body: JSON.stringify({ ...building, id: (building.id === BuildingCreationId ? '' : building.id) })
    }).then(c => asModel<GameDetails>(c));
  }

  export function deleteBuilding(id: string, buildingId: string): Promise<GameDetails> {
    return fetch(`/api/games/${ id }/buildings/${ buildingId }`, { method: 'DELETE' }).then(c => asModel<GameDetails>(c));
  }
}
