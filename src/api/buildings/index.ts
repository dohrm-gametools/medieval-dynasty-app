import { AnimalHusbandry } from './animal-husbandry';
import { Extraction } from './extraction';
import { Farming } from './farming';
import { House } from './house';
import { Hunting } from './hunting';
import { Production } from './production';
import { Service } from './service';
import { Building } from './definitions';

export * from './definitions';


export const Buildings: Array<Building> = [...AnimalHusbandry, ...Extraction, ...Farming, ...House, ...Hunting, ...Production, ...Service];
export { AnimalHusbandry, Extraction, Farming, House, Hunting, Production, Service };
