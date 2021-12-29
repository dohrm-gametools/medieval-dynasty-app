import { Item, ItemsById } from '../items';

export interface ItemWithCount {
  item: Item;
  count: number;
}

export interface Production {
  item: Item;
  buildingIds: Array<string>;
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
  return [ ...acc, { item: ItemsById[ kv.key ], count: kv.value } ];
}

const data = (require('./data.json') as Array<ProductionRaw>).reduce<Array<Production>>((acc, c) => {
  const item = ItemsById[ c.itemId ];
  const costs = c.costs.reduce(reduceItems, []);
  const otherProducedItems = c.otherProducedItems && toArray(c.otherProducedItems).reduce(reduceItems, []) || [];
  if (!item) return acc;
  return [ ...acc, {
    item,
    buildingIds: toArray(c.buildingIds),
    stack: c.stack,
    producedPerDay: c.producedPerDay,
    seasons: c.seasons ? toArray(c.seasons) : [],
    durabilityCost: c.durabilityCost && toKeyValue(c.durabilityCost) || undefined,
    otherProducedItems,
    costs,
  } ]
}, [])

export const Productions: Array<Production> = data;
