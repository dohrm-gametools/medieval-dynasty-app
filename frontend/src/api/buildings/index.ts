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

const data = require('./data.json') as Array<Building>;

export const Buildings: Array<Building> = data;
export const BuildingsById: { [ id: string ]: Building } = data.reduce((acc, c) => ({ ...acc, [ c.id ]: c }), {});

export const Houses: Array<Building> = data.filter(v => v.category.valueOf() === Kind.House.valueOf());
export const Hunting: Array<Building> = data.filter(v => v.category.valueOf() === Kind.Hunting.valueOf());
export const Farming: Array<Building> = data.filter(v => v.category.valueOf() === Kind.Farming.valueOf());
export const AnimalHusbandry: Array<Building> = data.filter(v => v.category.valueOf() === Kind.AnimalHusbandry.valueOf());
export const Productions: Array<Building> = data.filter(v => v.category.valueOf() === Kind.Production.valueOf());
export const Services: Array<Building> = data.filter(v => v.category.valueOf() === Kind.Service.valueOf());
export const Storages: Array<Building> = data.filter(v => v.category.valueOf() === Kind.Storage.valueOf());
