import { Building, GameDetails, Item, Production } from '~/src/api';
import { getProductionLevel } from './get-production-level';
import { EnrichedGame } from '~/src/app/game/services/get-enriched-game';

export type SummaryRow = { produced: number, consumed: number, balance: number };
export type SummaryRowWithId = SummaryRow & { id: string };

export interface DailySummary {
  totalTax: number;
  others: {
    wood: SummaryRow,
    water: SummaryRow,
    food: SummaryRow,
  };
  toolsDuration: Array<SummaryRowWithId>;
  productions: Array<SummaryRowWithId>;
}

interface AggregatorRow {
  produced: number;
  consumed: number;
}

interface Aggregator {
  tax: number;
  tools: { [ key: string ]: AggregatorRow };
  items: { [ key: string ]: AggregatorRow };
}

function computeSummaryRow(row: AggregatorRow, id: string): SummaryRowWithId;
function computeSummaryRow(row: AggregatorRow, id: string): SummaryRowWithId {
  return {
    id,
    produced: rounded(row.produced),
    consumed: rounded(row.consumed),
    balance: rounded(row.produced - row.consumed),
  }
}

function appendAggregate(key: string, field: 'produced' | 'consumed', value: number, aggregator: { [ key: string ]: { produced: number, consumed: number } }) {
  if (!aggregator[ key ]) {
    aggregator[ key ] = { produced: 0, consumed: 0 };
  }
  aggregator[ key ][ field ] += value;
}

function rounded(value: number): number { return Math.round(value * 100) / 100; }

export function dailySummary(
  game: EnrichedGame,
  rawBuildings: Array<Building>,
  rawProductions: Array<Production>,
  rawItems: Array<Item>
): DailySummary {
  const aggregator: Aggregator = {
    tax: 0,
    tools: {},
    items: {},
  };

  game.buildings.forEach(building => {
    const buildingBase = rawBuildings.find(c => c.id === building.buildingId);
    if (!buildingBase) return;
    aggregator.tax += building.tax;
    const productionLevel = getProductionLevel(buildingBase, building.assignedWorker, game) || 0;
    building.productions.forEach(production => {
      const productionBase = rawProductions.find(p => p.id === production.productionId);
      if (!productionBase) return;
      const maybeItem = rawItems.find(t => t.id === productionBase.itemId);
      const dailyProduced = productionBase.producedPerDay * (production.percentage / 100) * productionLevel; // TODO Add character peak, season modifier,...
      if (maybeItem && maybeItem.tool) {
        appendAggregate(maybeItem.tool, 'produced', dailyProduced * productionBase.stack * (maybeItem.durability || 0), aggregator.tools);
      }
      appendAggregate(productionBase.itemId, 'produced', dailyProduced * productionBase.stack, aggregator.items);
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

  const result: DailySummary = {
    totalTax: aggregator.tax,
    others: {
      wood: { produced: 0, consumed: game.workers.length * 30, balance: 0 }, // TODO Wood depends of the season and the kind of the house
      food: { produced: 0, consumed: game.workers.length * 30, balance: 0 },
      water: { produced: 0, consumed: game.workers.length * 30, balance: 0 },
    },
    toolsDuration: Object.keys(aggregator.tools).reduce<Array<SummaryRowWithId>>((acc, c) => [
      ...acc,
      computeSummaryRow(aggregator.tools[ c ], c)
    ], []),
    productions: Object.keys(aggregator.items).reduce<Array<SummaryRowWithId>>((acc, c) => [
      ...acc,
      computeSummaryRow(aggregator.items[ c ], c)
    ], [])
  };
  result.productions.forEach(item => {
    const maybeItem = rawItems.find(t => t.id === item.id);
    if (maybeItem && maybeItem.wood) {
      result.others.wood.produced += maybeItem.wood * item.balance;
    }
    if (maybeItem && maybeItem.water) {
      result.others.water.produced += maybeItem.water * item.balance;
    }
    if (maybeItem && maybeItem.food) {
      result.others.food.produced += maybeItem.food * item.balance;
    }
  });
  result.others.wood = computeSummaryRow(result.others.wood, 'wood');
  result.others.food = computeSummaryRow(result.others.food, 'food');
  result.others.water = computeSummaryRow(result.others.water, 'water');

  return result
}
