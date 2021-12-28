import { Kind } from './definitions';


export const AnimalHusbandry = [
  {
    id: 'henhouse',
    category: Kind.AnimalHusbandry,
    i18n: { en: 'Henhouse', fr: 'Poulailler' },
    tax: 15,
    worker: 1,
    capacity: 10,
    storage: 50,
    // productions? : Array < Production >,
  },
  {
    id: 'pigsty',
    category: Kind.AnimalHusbandry,
    i18n: { en: 'Pigsty', fr: 'Porcherie' },
    tax: 20,
    worker: 1,
    capacity: 5,
    storage: 50,
    // productions? : Array < Production >,
  },
  {
    id: 'goose-house',
    category: Kind.AnimalHusbandry,
    i18n: { en: 'Goose House', fr: 'Abris pour oies' },
    tax: 30,
    worker: 1,
    capacity: 10,
    storage: 50,
    // productions? : Array < Production >,
  },
  {
    id: 'fold',
    category: Kind.AnimalHusbandry,
    i18n: { en: 'Fold', fr: 'Bergerie' }, // Moutons
    tax: 40,
    worker: 1,
    capacity: 12,
    storage: 50,
    // productions? : Array < Production >,
  },
  {
    id: 'cowshed',
    category: Kind.AnimalHusbandry,
    i18n: { en: 'Cowshed', fr: 'Etable' },
    tax: 50,
    worker: 1,
    capacity: 8,
    storage: 50,
    // productions? : Array < Production >,
  },
  {
    id: 'stable',
    category: Kind.AnimalHusbandry,
    i18n: { en: 'Stable', fr: 'Ecurie' },
    tax: 50,
    worker: 1,
    capacity: 4,
    storage: 100,
    // productions? : Array < Production >,
  },
  {
    id: 'apiary',
    category: Kind.AnimalHusbandry,
    i18n: { en: 'Apiary', fr: 'Rucher' },
    tax: 20,
    worker: 1,
    storage: 50,
    productionRate: { spring: 1, summer: 1, autumn: 0.5, winter: 0.25 }
    // productions? : Array < Production >,
  },
];

