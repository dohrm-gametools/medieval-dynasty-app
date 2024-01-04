import { ActionReducerMapBuilder, AsyncThunk, CaseReducer, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State as I18nState } from '~/src/lib/i18n';
import {
  Building,
  BuildingKind,
  BuildingsApi,
  GameApi,
  GameDetails,
  Item,
  ItemsApi,
  Production,
  ProductionsApi, ProductionWithAssignment,
  TownBuilding,
  UpdateGameDetails,
  Worker,
} from '~/src/api';
import * as services from './services';
import { EnrichedTownBuilding, ProductionLine } from './services';

export const reduxKey = 'game';
const list = createAsyncThunk(
  `${reduxKey}/list`,
  () => {
    return Promise.all([
        GameApi.one(),
        BuildingsApi.fetchAll(),
        ProductionsApi.fetchAll(),
        ItemsApi.fetchAll(),
      ]
    )
  },
);

const updateGameDetails = createAsyncThunk(
  `${reduxKey}/updateGameDetails`,
  (payload: { id: string, payload: UpdateGameDetails }) => GameApi.updateGameDetails(payload.id, payload.payload)
)

//
const saveWorker = createAsyncThunk(
  `${reduxKey}/saveWorker`,
  (payload: { id: string, worker: Worker }) => GameApi.createOrUpdateWorker(payload.id, payload.worker),
)

const deleteWorker = createAsyncThunk(
  `${reduxKey}/deleteWorker`,
  (payload: { id: string, worker: string }) => GameApi.deleteWorker(payload.id, payload.worker),
)

const saveBuilding = createAsyncThunk(
  `${reduxKey}/saveBuilding`,
  (payload: { id: string, building: TownBuilding }) => GameApi.createOrUpdateBuilding(payload.id, payload.building),
)

const deleteBuilding = createAsyncThunk(
  `${reduxKey}/deleteBuilding`,
  (payload: { id: string, building: string }) => GameApi.deleteBuilding(payload.id, payload.building),
)

const saveProductionLine = createAsyncThunk(
  `${reduxKey}/addProductionLine`,
  (payload: { id: string, production: ProductionWithAssignment, building: TownBuilding }) =>
    GameApi.createOrUpdateBuilding(payload.id, {
      ...payload.building,
      productions: [...payload.building.productions.filter(f => f.productionId !== payload.production.productionId), payload.production],
    })
)

const deleteProductionLine = createAsyncThunk(
  `${reduxKey}/deleteProductionLine`,
  (payload: { id: string, production: ProductionWithAssignment, building: TownBuilding }) =>
    GameApi.createOrUpdateBuilding(payload.id, {
      ...payload.building,
      productions: [...payload.building.productions.filter(f => f.productionId !== payload.production.productionId)],
    })
)

export interface SliceState {
  listLoaded: boolean;
  loading: boolean;
  game: services.EnrichedGame,
  buildings: Array<Building>;
  productions: Array<Production>;
  items: Array<Item>;
  error?: string;
}

export interface State extends I18nState {
  game: SliceState;
}

const initialState: SliceState = {
  listLoaded: false,
  loading: false,
  game: {
    id: '',
    year: 0,
    season: 'spring',
    buildings: [],
    workers: [],
  },
  buildings: [],
  productions: [],
  items: [],
  error: undefined,
};

const defaultOnSuccess: CaseReducer<SliceState, PayloadAction<GameDetails>> = (state, action) => {
  state.loading = false;
  state.game = services.getEnrichedGame(action.payload, state.buildings);
}

function addAsyncCases<Payload>(
  builder: ActionReducerMapBuilder<SliceState>,
  action: AsyncThunk<Payload, any, {}>,
  onSuccess: CaseReducer<SliceState, PayloadAction<Payload>>
): ActionReducerMapBuilder<SliceState> {
  return builder
    .addCase(action.pending, (state) => {
      state.loading = true;
    })
    .addCase(action.fulfilled, onSuccess)
    .addCase(action.rejected, (state, err) => {
      state.loading = false;
      state.error = err.error.message;
    })
}

const slice = createSlice({
  name: reduxKey,
  initialState,
  reducers: {
    cleanup(state) {
      state = initialState
    }
  },
  extraReducers: builder => {
    let b = builder
      .addCase(list.pending, (state) => {
        state.listLoaded = false;
      })
      .addCase(list.fulfilled, (state, action) => {
        const [game, buildings, products, items] = action.payload
        state.listLoaded = true;
        if (!game) {
          // Should not append ...
          state.error = 'something wrong appends';
          return;
        }
        state.buildings = buildings;
        state.productions = products;
        state.items = items;
        state.game = services.getEnrichedGame(game, buildings);
      })
    b = addAsyncCases(b, updateGameDetails, defaultOnSuccess);
    b = addAsyncCases(b, saveWorker, defaultOnSuccess);
    b = addAsyncCases(b, deleteWorker, defaultOnSuccess);
    b = addAsyncCases(b, saveBuilding, defaultOnSuccess);
    b = addAsyncCases(b, deleteBuilding, defaultOnSuccess);
    b = addAsyncCases(b, saveProductionLine, defaultOnSuccess);
    b = addAsyncCases(b, deleteProductionLine, defaultOnSuccess);
  }
});


export { getProductionLevel } from './services/get-production-level';
export { categorySort } from './services/get-enriched-game';

export const { cleanup } = slice.actions;
export { list, updateGameDetails, saveWorker, deleteWorker, saveBuilding, deleteBuilding, saveProductionLine, deleteProductionLine };
export const selectors = {
  loading(state: State) { return state.game.loading },
  listLoaded(state: State) { return state.game.listLoaded },
  game(state: State) { return state.game.game },
  productions(state: State) { return state.game.productions },
  productionLines(state: State) { return services.getProductionLines(state.game.game, state.game.productions) },
  tools(state: State) { return state.game.items },
  rawBuildingById(state: State) {
    return state.game.buildings.reduce<{ [id: string]: Building }>((acc, c) => ({ ...acc, [c.id]: c }), {});
  },
  buildingsByCategory(state: State) {
    return state.game.game.buildings.reduce((acc, c) => {
      const building = state.game.buildings.find(b => b.id === c.buildingId);
      if (building) {
        return { ...acc, [building.category.valueOf()]: [...acc[building.category.valueOf()], c] };
      }
      return acc;
    }, {
      [BuildingKind.House.valueOf()]: [] as Array<EnrichedTownBuilding>,
      [BuildingKind.Extraction.valueOf()]: [] as Array<EnrichedTownBuilding>,
      [BuildingKind.Hunting.valueOf()]: [] as Array<EnrichedTownBuilding>,
      [BuildingKind.Farming.valueOf()]: [] as Array<EnrichedTownBuilding>,
      [BuildingKind.AnimalHusbandry.valueOf()]: [] as Array<EnrichedTownBuilding>,
      [BuildingKind.Production.valueOf()]: [] as Array<EnrichedTownBuilding>,
      [BuildingKind.Service.valueOf()]: [] as Array<EnrichedTownBuilding>,
      [BuildingKind.Storage.valueOf()]: [] as Array<EnrichedTownBuilding>,
    })
  },
  summary(state: State) { return services.dailySummary(state.game.game, state.game.buildings, state.game.productions, state.game.items)}
}

export default slice.reducer;
