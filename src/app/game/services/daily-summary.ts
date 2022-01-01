import { Building, GameDetails, Item, Production } from '~/src/api';
import { getProductionLevel } from './get-production-level';

export interface DailySummary {
  totalTax: number;
  toolsDuration: Array<{ toolId: string, produced: number, consumed: number, balance: number }>;
  productions: Array<{ itemId: string, produced: number, consumed: number, balance: number }>;
}

interface Aggregator {
  tax: number;
  tools: { [ key: string ]: { produced: number, consumed: number } };
  items: { [ key: string ]: { produced: number, consumed: number } };
}

function appendAggregate(key: string, field: 'produced' | 'consumed', value: number, aggregator: { [ key: string ]: { produced: number, consumed: number } }) {
  if (!aggregator[ key ]) {
    aggregator[ key ] = { produced: 0, consumed: 0 };
  }
  aggregator[ key ][ field ] += value;
}

export function dailySummary(
  game: GameDetails,
  rawBuildings: Array<Building>,
  rawProductions: Array<Production>,
  rawTools: Array<Item>
): DailySummary {
  const aggregator: Aggregator = { tax: 0, tools: {}, items: {} };

  game.buildings.forEach(building => {
    const buildingBase = rawBuildings.find(c => c.id === building.buildingId);
    if (!buildingBase) return;
    aggregator.tax += buildingBase.tax;
    const productionLevel = getProductionLevel(buildingBase, building.assignedWorker, game) || 0;
    building.productions.forEach(production => {
      const productionBase = rawProductions.find(p => p.id === production.productionId);
      if (!productionBase) return;
      const maybeTool = rawTools.find(t => t.id === productionBase.itemId);
      const dailyProduced = productionBase.producedPerDay * (production.percentage / 100) * productionLevel; // TODO Add character peak, season modifier
      if (maybeTool && maybeTool.tool) {
        appendAggregate(maybeTool.tool, 'produced', dailyProduced * productionBase.stack * (maybeTool.duration || 0), aggregator.tools);
      } else {
        appendAggregate(productionBase.itemId, 'produced', dailyProduced * productionBase.stack, aggregator.items);
      }
      productionBase.otherProducedItems.forEach(other => {
        appendAggregate(other.id, 'produced', dailyProduced * other.count, aggregator.items);
      });
      if (productionBase.durabilityCost) {
        appendAggregate(productionBase.durabilityCost.key, 'consumed', dailyProduced * productionBase.durabilityCost.value, aggregator.tools);
      }
      productionBase.costs.forEach(other => {
        appendAggregate(other.id, 'consumed', dailyProduced * other.count, aggregator.items);
      });
    });
  });

  return {
    totalTax: aggregator.tax,
    toolsDuration: Object.keys(aggregator.tools).reduce<Array<{ toolId: string, produced: number, consumed: number, balance: number }>>((acc, c) => [ ...acc, {
      toolId: c,
      produced: aggregator.tools[ c ].produced,
      consumed: aggregator.tools[ c ].consumed,
      balance: aggregator.tools[ c ].produced - aggregator.tools[ c ].consumed,
    } ], []),
    productions: Object.keys(aggregator.items).reduce<Array<{ itemId: string, produced: number, consumed: number, balance: number }>>((acc, c) => [ ...acc, {
      itemId: c,
      produced: aggregator.items[ c ].produced,
      consumed: aggregator.items[ c ].consumed,
      balance: aggregator.items[ c ].produced - aggregator.items[ c ].consumed,
    } ], [])
  }
}
