import { ItemsById } from '../items';
import { BuildingsById } from '../buildings';

export interface WithI18n {
  i18n: { [ lang: string ]: string }
}

export interface ItemWithCount extends WithI18n {
  id: string;
  count: number;
}

export interface BuildingLight extends WithI18n {
  id: string;
}

export interface Production {
  itemId: string;
  i18n: { [ lang: string ]: string };
  producedIn: Array<BuildingLight>;
  stack: number;
  producedPerDay: number;
  seasons: Array<string>;
  durabilityCost?: { key: string, value: number };
  otherProducedItems: Array<ItemWithCount>;
  costs: Array<ItemWithCount>;
}

interface ProductionRaw {
  itemId: string;
  buildingIds: string;
  stack: number;
  producedPerDay: number;
  seasons?: string;
  durabilityCost?: string;
  otherProducedItems?: string;
  costs: Array<string>;
}

function toArray(value: string): Array<string> {
  return value.split(',');
}

function toKeyValue(value: string): { key: string, value: number } | null {
  const asArray = value.split(':')
  if (asArray.length !== 2) {
    return null;
  }
  const [ key, v ] = asArray;
  return { key, value: parseInt(v) };
}

function reduceItems(acc: Array<ItemWithCount>, c: string): Array<ItemWithCount> {
  const kv = toKeyValue(c);
  if (!kv || !ItemsById[ kv.key ]) return acc;
  const item = ItemsById[ kv.key ];
  return [ ...acc, { id: item.id, i18n: item.i18n, count: kv.value } ];
}

function reduceBuildings(acc: Array<BuildingLight>, c: string): Array<BuildingLight> {
  const building = BuildingsById[ c ];
  if (!building) return acc;
  return [ ...acc, { id: building.id, i18n: building.i18n } ];
}

const data = (require('./data.json') as Array<ProductionRaw>).reduce<Array<Production>>((acc, c) => {
  const item = ItemsById[ c.itemId ];
  const costs = c.costs.reduce(reduceItems, []);
  const otherProducedItems = c.otherProducedItems && toArray(c.otherProducedItems).reduce(reduceItems, []) || [];
  if (!item) return acc;
  return [ ...acc, {
    itemId: c.itemId,
    i18n: item.i18n,
    producedIn: toArray(c.buildingIds).reduce(reduceBuildings, []),
    stack: c.stack,
    producedPerDay: c.producedPerDay,
    seasons: c.seasons ? toArray(c.seasons) : [],
    durabilityCost: c.durabilityCost && toKeyValue(c.durabilityCost) || undefined,
    otherProducedItems,
    costs,
  } ]
}, [])

export const Productions: Array<Production> = data;
