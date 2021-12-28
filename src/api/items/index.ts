export enum Kind {
  Clothes = 'clothes',
  Consumable = 'consumable',
  Crafting = 'crafting',
  Miscellaneous = 'miscellaneous',
  Tools = 'tools',
}

export enum Tool {
  Hammer = 'hammer',
  Knife = 'knife',
  Axe = 'axe',
  Hoe = 'hoe',
  Shovel = 'shovel',
  Sickle = 'sickle',
  Scythe = 'scythe',
  Pickaxe = 'pickaxe',
  ShearingScissors = 'shearing-scissors',
}

export interface Item {
  id: string;
  category: Kind;
  durability: number;
  weight: number;
  price: number;
  i18n: { [lang: string]: string };
  tool?: Tool;
  damage?: number;
  poisoning?: number;
  extraction?: number;
  heat?: number;
  cold?: number;
  weightLimit?: number;
  health?: number;
  stamina?: number;
  food?: number;
  water?: number;
  wood?: number;
  alcohol?: number;
  foodConsumption?: number;
  staminaConsumption?: number;
  waterConsumption?: number;
  additionalHealth?: number;
  temperatureTolerance?: number;
  additionalDamage?: number;
  duration?: number;
}

const data = require('./data.json') as Array<Item>;

export const Items: Array<Item> = data;
export const Tools: Array<Item> = data.filter(v => v.category.valueOf() === Kind.Tools.valueOf());
export const Crafting: Array<Item> = data.filter(v => v.category.valueOf() === Kind.Crafting.valueOf());
export const Clothes: Array<Item> = data.filter(v => v.category.valueOf() === Kind.Clothes.valueOf());
export const Consumable: Array<Item> = data.filter(v => v.category.valueOf() === Kind.Consumable.valueOf());
export const Miscellaneous: Array<Item> = data.filter(v => v.category.valueOf() === Kind.Miscellaneous.valueOf());
