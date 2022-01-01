import { Building, GameDetails } from '~/src/api';

export function getProductionLevel(building: Building, workers: Array<string>, game: GameDetails): number | undefined {
  const skill = building.workerSkill;
  if (!skill) return undefined;
  return workers.reduce((acc, c) => {
    const w = game.workers.find(w => w.id === c)
    if (!w) return acc;
    return acc + w.skills[ skill ];
  }, 0);
}
