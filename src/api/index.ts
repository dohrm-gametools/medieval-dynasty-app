import * as items from './items';
import * as buildings from './buildings';
import * as productions from './productions';

export { Building, Kind as BuildingKing } from './buildings';
export { Item, Kind as ItemKind } from './items'
export { Production } from './productions'

export module ItemsApi {
  // TODO Write real api maybe with parameters.
  export function fetchAll(): Promise<Array<items.Item>> {
    return Promise.resolve(items.Items);
  }

  export function fetchClothes(): Promise<Array<items.Item>> {
    return Promise.resolve(items.Clothes);
  }

  export function fetchConsumable(): Promise<Array<items.Item>> {
    return Promise.resolve(items.Consumable);
  }

  export function fetchCrafting(): Promise<Array<items.Item>> {
    return Promise.resolve(items.Crafting);
  }

  export function fetchMiscellaneous(): Promise<Array<items.Item>> {
    return Promise.resolve(items.Miscellaneous);
  }
}

export module BuildingsApi {
  export function fetchAll(): Promise<Array<buildings.Building>> {
    return Promise.resolve(buildings.Buildings);
  }
}

export module ProductionsApi {
  export function fetchAll(): Promise<Array<productions.Production>> {
    return Promise.resolve(productions.Productions);
  }
}
