export interface ItemWithCount {
  id: string;
  count: number;
}

export interface Production {
  id: string;
  itemId: string;
  producedIn: Array<string>;
  stack: number;
  producedPerDay: number;
  seasons: Array<string>;
  durabilityCost?: { key: string, value: number };
  otherProducedItems: Array<ItemWithCount>;
  costs: Array<ItemWithCount>;
}
