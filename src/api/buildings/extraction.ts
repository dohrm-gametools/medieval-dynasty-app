import { ItemsDictionary } from '~/src/api/items';
import { Kind } from './definitions';

export const Extraction = [
  {
    id: 'woodshed-i',
    category: Kind.Extraction,
    i18n: { en: 'Woodshed I', fr: 'Abri à bois I' },
    tax: 30,
    worker: 1,
    storage: 50,
    productions: [
      { itemRef: ItemsDictionary.Log.id },
      { itemRef: ItemsDictionary.Stick.id },
      { itemRef: ItemsDictionary.Firewood.id },
      { itemRef: ItemsDictionary.Plank.id },
    ]
  },
  {
    id: 'woodshed-ii',
    category: Kind.Extraction,
    i18n: { en: 'Woodshed II', fr: 'Abri à bois II' },
    tax: 30,
    worker: 2,
    storage: 50,
    productions: [
      { itemRef: ItemsDictionary.Log.id },
      { itemRef: ItemsDictionary.Stick.id },
      { itemRef: ItemsDictionary.Firewood.id },
      { itemRef: ItemsDictionary.Plank.id },
    ]
  },
];
