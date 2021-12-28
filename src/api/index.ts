import * as items from './items';

export { Item, Kind, Tool } from './items'

export namespace ItemsApi {
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

export namespace Buildings {}
