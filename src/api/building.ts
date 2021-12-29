// export enum Kind {
//   Houses = 'houses',
//   Extraction = 'extraction',
//   Hunting = 'hunting',
//   Farming = 'farming',
//   Animal = 'animal',
//   Production = 'production',
//   Service = 'service',
//   Storage = 'storage'
// }
//
// export type Building = { id: string, kind: Kind };
// export namespace Building {
//   // If you add any building here, don't forget to add it in `AllBuildings`
//   const building = (id: string, kind: Kind): Building => ({ id, kind });
//   // Houses
//   export const SimpleSmallHouse: Building = building('simple-small-house', Kind.Houses);
//   export const SimpleHouse: Building = building('simple-house', Kind.Houses);
//   export const House: Building = building('house', Kind.Houses);
//   // Extractions
//   export const Woodshed1: Building = building('woodshed-1', Kind.Extraction);
//   export const Woodshed2: Building = building('woodshed-2', Kind.Extraction);
//   export const ExcavationShed1: Building = building('excavation-shed-1', Kind.Extraction);
//   export const Mine: Building = building('mine', Kind.Extraction);
//   export const Well: Building = building('well', Kind.Extraction);
//   export const HerbalistHut1: Building = building('herbalist-hut-1', Kind.Extraction);
//   export const HerbalistHut2: Building = building('herbalist-hut-2', Kind.Extraction);
//   export const HuntingLodge1: Building = building('hunting-lodge-1', Kind.Hunting);
//   export const HuntingLodge2: Building = building('hunting-lodge-2', Kind.Hunting);
//   export const FishingLodge1: Building = building('fishing-lodge-1', Kind.Hunting);
//   export const FishingLodge2: Building = building('fishing-lodge-2', Kind.Hunting);
//   // Farming
//   export const Barn1: Building = building('barn-1', Kind.Farming);
//   export const Barn2: Building = building('barn-2', Kind.Farming);
//   export const Barn3: Building = building('barn-3', Kind.Farming);
//   export const Field: Building = building('field', Kind.Farming);
//   export const Orchard: Building = building('orchard', Kind.Farming);
//   // Animal
//   export const HenHouse: Building = building('hen-house', Kind.Animal);
//   export const GooseHouse: Building = building('goose-House', Kind.Animal);
//   export const Pigsty: Building = building('pigsty', Kind.Animal);
//   export const Cowshed: Building = building('cowshed', Kind.Animal);
//   export const Stable: Building = building('stable', Kind.Animal);
//   export const Apiary: Building = building('apiary', Kind.Animal);
//   // Production
//   export const Workshop1: Building = building('workshop-1', Kind.Production);
//   export const Workshop2: Building = building('workshop-2', Kind.Production);
//   export const Workshop3: Building = building('workshop-3', Kind.Production);
//   export const Smithy1: Building = building('smithy-1', Kind.Production);
//   export const Smithy2: Building = building('smithy-2', Kind.Production);
//   export const Smithy3: Building = building('smithy-3', Kind.Production);
//   export const Sewing1: Building = building('sewing-1', Kind.Production);
//   export const Sewing2: Building = building('sewing-2', Kind.Production);
//   export const Sewing3: Building = building('sewing-3', Kind.Production);
//   export const Tavern: Building = building('tavern', Kind.Production);
//   export const Kitchen1: Building = building('kitchen-1', Kind.Production);
//   export const Kitchen2: Building = building('kitchen-2', Kind.Production);
//   // Service
//   export const MarketStall: Building = building('market-stall', Kind.Service);
//   export const BuilderHut: Building = building('builder-hut', Kind.Service);
//
//   export const AllBuildings: Array<Building> = [
//     // Houses
//     SimpleSmallHouse,
//     SimpleHouse,
//     House,
//     // Extractions
//     Woodshed1,
//     Woodshed2,
//     ExcavationShed1,
//     Mine,
//     Well,
//     HerbalistHut1,
//     HerbalistHut2,
//     HuntingLodge1,
//     HuntingLodge2,
//     FishingLodge1,
//     FishingLodge2,
//     // Farming
//     Barn1,
//     Barn2,
//     Barn3,
//     Field,
//     Orchard,
//     // Animal
//     HenHouse,
//     GooseHouse,
//     Pigsty,
//     Cowshed,
//     Stable,
//     Apiary,
//     // Production
//     Workshop1,
//     Workshop2,
//     Workshop3,
//     Smithy1,
//     Smithy2,
//     Smithy3,
//     Sewing1,
//     Sewing2,
//     Sewing3,
//     Tavern,
//     Kitchen1,
//     Kitchen2,
//     // Service
//     MarketStall,
//     BuilderHut,
//   ]
// }
