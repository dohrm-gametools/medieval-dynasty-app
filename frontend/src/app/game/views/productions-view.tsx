import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ButtonGroup, IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { ColumnDef, createColumnDef, generateSortFunction, Table } from '~/src/lib/table';
import { Building, BuildingCreationId, Production, TownBuilding } from '~/src/api';
import { useI18n } from '~/src/lib/i18n';
import { DropdownOptionGrouped } from '~/src/lib/dropdown';
import SectionPageView from '~/src/lib/app-layout/view/section-page-view';
import { categorySort, deleteProductionLine, selectors } from '../reducer';
import { DailySummary, EnrichedGame, ProductionLine, SummaryRowWithId } from '../services';


function createDraft(buildingId: string): TownBuilding {
  return {
    id: BuildingCreationId,
    buildingId,
    assignedWorker: [],
    productions: [],
  }
}

type BuildingByCategory = { id: string, buildings: Array<ProductionLine> };

const ButtonActions: React.ComponentType<{ productionLine: ProductionLine, onRemove: (w: ProductionLine) => any }> =
  ({ productionLine, onRemove }) => (
    <ButtonGroup>
      <IconButton aria-label="delete" onClick={() => onRemove(productionLine)}><DeleteIcon/></IconButton>
    </ButtonGroup>
  );

function buildOptions(buildings: { [key: string]: Building }, t: (key: string) => string): Array<DropdownOptionGrouped> {
  const result: { [key: string]: DropdownOptionGrouped } = {}
  Object.values(buildings).forEach(building => {
    const category = building.category.valueOf();
    if (!result[category]) {
      result[category] = { id: category, text: t(`app.buildings.category.${category}`), options: [] }
    }
    result[category].options.push({
      id: building.id,
      text: t(`db.buildings.${building.id}`),
    });

  })
  return Object.values(result).sort((a, b) => {
    const va = categorySort[a.id] || 99;
    const vb = categorySort[b.id] || 99;
    if (va < vb) return -1;
    if (va > vb) return 1;
    return 0;
  });
}

const ProductionsTable: React.ComponentType<{
  game: EnrichedGame,
  productionLines: Array<ProductionLine>,
  summary: DailySummary
}> =
  ({
     game,
     productionLines,
     summary
   }) => {
    const dispatch = useDispatch();
    const { t, lang } = useI18n();
    const [sort, setSort] = React.useState<string>('');

    const onRemove = (b: ProductionLine) => {
      dispatch(deleteProductionLine({ id: game.id, production: b.production, building: b.building }));
    }
    const summaryByProduct: { [key: string]: SummaryRowWithId } = summary.productions.reduce((acc, c) => ({ ...acc, [c.id]: c }), {});
    console.log(summaryByProduct);
    const columns: Array<ColumnDef<ProductionLine>> = [
      createColumnDef('', 10, 'app.game.productions', t, { render: c => <ButtonActions productionLine={c} onRemove={onRemove}/> }),
      createColumnDef('name', 40, 'app.game.productions', t, {
        sortable: true,
        accessor: c => `${t(`db.items.${c.itemId}`)}`
      }),
      createColumnDef('building', 40, 'app.game.productions', t, {
        sortable: true,
        accessor: c => `${t(`db.buildings.${c.building.buildingId}`)}${c.building.alias && ' (' + c.building.alias + ')' || ''}`
      }),
      createColumnDef('production', 20, 'app.game.productions', t, {
        sortable: true,
        accessor: b => b.production.productionValue
      }),
      createColumnDef('+', 20, 'app.game.productions', t, {
        sortable: true,
        accessor: b => summaryByProduct[b.itemId]?.produced || 0
      }),
      createColumnDef('-', 20, 'app.game.productions', t, {
        sortable: true,
        accessor: b => (summaryByProduct[b.itemId]?.consumed || 0) * -1
      }),
      createColumnDef('total', 20, 'app.game.productions', t, {
        sortable: true,
        accessor: b => (summaryByProduct[b.itemId]?.balance || 0)
      }),
    ];
    const sortFunction = generateSortFunction(sort, columns);

    return (
      <>
        <Table<ProductionLine>
          tableId="productionLines"
          totalCount={productionLines.length}
          columns={columns}
          data={[...productionLines].sort(sortFunction)}
          sort={sort}
          changeSort={setSort}
        />
      </>
    );
  }

const ProductionsView: React.ComponentType = () => {
  const game = useSelector(selectors.game);
  const productionLines = useSelector(selectors.productionLines);
  const summary = useSelector(selectors.summary);
  return (
    <SectionPageView>
      <ProductionsTable productionLines={productionLines} game={game} summary={summary}/>
    </SectionPageView>
  );
};

export default ProductionsView;
