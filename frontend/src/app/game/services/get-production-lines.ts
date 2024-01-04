import { Item, Production, ProductionWithAssignment } from '~/src/api';
import { EnrichedGame, EnrichedTownBuilding } from '~/src/app/game/services/get-enriched-game';

export interface ProductionLine {
  id: string;
  production: ProductionWithAssignment;
  itemId: string;
  building: EnrichedTownBuilding;
}

export function getProductionLines(game: EnrichedGame, productions: Array<Production>): Array<ProductionLine> {
  const productionsById: { [key: string]: string } = productions.reduce((acc, c) => ({ ...acc, [c.id]: c.itemId }), {});
  return game.buildings.reduce<Array<ProductionLine>>((result, current) => {
    return [
      ...result,
      ...current.productions.map(p => ({
        id: `${current.id}-${p.productionId}`,
        production: p,
        itemId: productionsById[p.productionId],
        building: current
      }))
    ];
  }, []);
}
