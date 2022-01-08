export enum Kind {
  House = 'house',
  Extraction = 'extraction',
  Hunting = 'hunting',
  Farming = 'farming',
  AnimalHusbandry = 'animal-husbandry',
  Production = 'production',
  Service = 'service',
  Storage = 'storage'
}

export type WorkerSkill = 'extraction' | 'hunting' | 'farming' | 'diplomacy' | 'survival' | 'crafting';

export interface Building {
  id: string;
  category: Kind;
  tax: number;
  i18n: { [ lang: string ]: string };
  workerSkill?: WorkerSkill;
  storage?: number;
  worker?: number;
  capacity?: number;
}
