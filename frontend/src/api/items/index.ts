export enum Kind {
  Clothes = 'clothes',
  Consumable = 'consumable',
  Crafting = 'crafting',
  Miscellaneous = 'miscellaneous',
  Tools = 'tools',
}

export interface Item {
  id: string;
  category: Kind;
  durability: number;
  weight: number;
  price: number;
  i18n: { [ lang: string ]: string };
  tool?: string;
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
