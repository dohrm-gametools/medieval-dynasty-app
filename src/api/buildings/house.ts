import { Kind } from './definitions';

export const House = [
  {
    id: 'simple-small-house',
    category: Kind.House,
    i18n: { en: 'Simple Small House', fr: 'Petite maison ordinaire' },
    tax: 10,
    capacity: 3,
    storage: 50,
  },
  {
    id: 'simple-house',
    category: Kind.House,
    i18n: { en: 'Simple House', fr: 'Maison ordinaire' },
    tax: 20,
    capacity: 4,
    storage: 50,
    // productions? : Array < Production >,
  },
  {
    id: 'house',
    category: Kind.House,
    i18n: { en: 'House', fr: 'Maison' },
    tax: 30,
    capacity: 4,
    storage: 50,
  }
];
