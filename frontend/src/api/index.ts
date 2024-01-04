import * as items from './items';
import * as buildings from './buildings';
import * as productions from './productions';
import { GameDetails, TownBuilding, Worker, UpdateGameDetails } from './games';
import { getRandomName } from '~/src/api/name-generator';

export { Building, Kind as BuildingKind } from './buildings';
export { Item, Kind as ItemKind } from './items'
export { Production } from './productions'
export * from './games';


function asModel<T>(response: Response): Promise<T> {
  if (response.status >= 400) {
    return Promise.reject(`[${response.status}] error in api call`)
  }
  return response.json();
}

export module I18nApi {
  export function load(): Promise<{ [lang: string]: { [key: string]: string } }> {
    return fetch(`/api/i18n`).then(c => asModel<{ [lang: string]: { [key: string]: string } }>(c));
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
  const keyGames = 'medieval-dynasty-game-ids'

  function getId(): string | undefined {
    const id = localStorage.getItem(keyId);
    return !id || id === '' ? undefined : id;
  }

  function read(id: string): Promise<GameDetails> {
    if (!id || id === '') {
      return create();
    }

    return fetch(`/api/games/${id}`).then(c => {
      if (c.status === 404) return create();
      return asModel<GameDetails>(c);
    }).then(g => ({ ...g, year: g.year || 0, season: g.season || 'spring' })); // Fix missing model attributes
  }

  export async function current(): Promise<GameDetails> {
    const id = getId();
    return one(id || '');
  }

  export async function change(id: string) {
    localStorage.setItem(keyId, id);
  }

  export function listGames(): Array<{ id: string, name: string }> {
    const json = localStorage.getItem(keyGames);
    if (!json || json === '') {
      const currentId = getId();
      if (!currentId || currentId === '') {
        return [];
      }
      const res = [{ id: currentId, name: getRandomName() }];
      localStorage.setItem(keyGames, JSON.stringify(res));
      return res;
    }
    return JSON.parse(json);
  }

  export function addGame(id: string, name: string) {
    const games = listGames();
    if (games.findIndex(v => v.id === id) === -1) {
      let gameName = name;
      if (gameName === '') {
        let retry = 0;
        do {
          gameName = getRandomName(retry);
          retry++;
        } while (games.findIndex(v => v.name === gameName) > -1)
      }
      games.push({ id, name: gameName });
      localStorage.setItem(keyGames, JSON.stringify(games));
    }
  }

  export function create(name: string = ''): Promise<GameDetails> {
    return fetch('/api/games', { method: 'POST' }).then(c => asModel<GameDetails>(c)).then(res => {
      localStorage.setItem(keyId, res.id);
      addGame(res.id, name);
      return res;
    });
  }

  export async function remove(id: string): Promise<void> {
    if (id === getId()) return; // Cannot remove current game
    // TODO Remove game in database
    const games = listGames();
    games.splice(games.findIndex(v => v.id === id), 1);
    localStorage.setItem(keyGames, JSON.stringify(games));
  }

  export function one(id: string): Promise<GameDetails> {
    return read(id);
  }

  export function updateGameDetails(id: string, data: UpdateGameDetails): Promise<GameDetails> {
    return fetch(`/api/games/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data })
    }).then(c => asModel<GameDetails>(c));
  }

  export function createOrUpdateWorker(id: string, worker: Worker): Promise<GameDetails> {
    return fetch(`/api/games/${id}/workers`, {
      method: 'PUT',
      body: JSON.stringify({ ...worker, id: (worker.id === WorkerCreationId ? '' : worker.id) })
    }).then(c => asModel<GameDetails>(c));
  }

  export function deleteWorker(id: string, workerId: string): Promise<GameDetails> {
    return fetch(`/api/games/${id}/workers/${workerId}`, { method: 'DELETE' }).then(c => asModel<GameDetails>(c));
  }

  export function createOrUpdateBuilding(id: string, building: TownBuilding): Promise<GameDetails> {
    return fetch(`/api/games/${id}/buildings`, {
      method: 'PUT',
      body: JSON.stringify({ ...building, id: (building.id === BuildingCreationId ? '' : building.id) })
    }).then(c => asModel<GameDetails>(c));
  }

  export function deleteBuilding(id: string, buildingId: string): Promise<GameDetails> {
    return fetch(`/api/games/${id}/buildings/${buildingId}`, { method: 'DELETE' }).then(c => asModel<GameDetails>(c));
  }
}
