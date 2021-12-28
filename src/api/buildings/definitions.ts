export enum Kind {
  AnimalHusbandry = 'animal-husbandry',
  Extraction = 'extraction',
  Farming = 'farming',
  House = 'house',
  Hunting = 'hunting',
  Production = 'production',
  Service = 'service',
  Storage = 'storage',
}

export interface Production {
  itemRef: string;
  // TODO production capacity per skill point at 100% of worker.
}

export interface Building {
  id: string;
  category: Kind;
  i18n: { [lang: string]: string };
  tax: number;
  worker?: number;
  capacity?: number;
  storage?: number;
  productions?: Array<Production>;
  productionRate?: { spring: number; summer: number; autumn: number; winter: number; };
}
