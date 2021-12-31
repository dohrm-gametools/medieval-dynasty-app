import * as items from './items';
import * as buildings from './buildings';
import * as productions from './productions';

export { Building, Kind as BuildingKind } from './buildings';
export { Item, Kind as ItemKind } from './items'
export { Production } from './productions'
export * from './games';

export module I18nApi {
  export function load(): Promise<{ [ lang: string ]: { [ key: string ]: string } }> {
    const result: { [ lang: string ]: { [ key: string ]: string } } = {};
    const reduce = (category: string, res: typeof result, obj: { id: string, i18n: { [ lang: string ]: string } }) => {
      return Object.keys(obj.i18n).reduce((acc, c) => {
        return { ...acc, [ c ]: { ...(acc[ c ] || {}), [ `${ category }.${ obj.id }` ]: obj.i18n[ c ] } };
      }, res)
    }
    return Promise.resolve(
      buildings.Buildings.reduce((acc, c) => reduce('db.buildings', acc, c),
        items.Items.reduce((acc, c) => reduce('db.items', acc, c), result)
      )
    );
  }
}

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
