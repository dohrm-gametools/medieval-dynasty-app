import { ActionReducerMapBuilder, AsyncThunk, CaseReducer, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State as I18nState } from '~/src/app/i18n';
import { Building, BuildingKind, BuildingsApi, GameApi, GameDetails, Item, ItemsApi, Production, ProductionsApi, TownBuilding, Worker, } from '~/src/api';
import * as services from './services';
import { EnrichedTownBuilding } from './services';

export const reduxKey = 'game';
const list = createAsyncThunk(
  `${ reduxKey }/list`,
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

//
const saveWorker = createAsyncThunk(
  `${ reduxKey }/saveWorker`,
  (payload: { worker: Worker }) => GameApi.createOrUpdateWorker(payload.worker),
)

const deleteWorker = createAsyncThunk(
  `${ reduxKey }/deleteWorker`,
  (payload: { worker: string }) => GameApi.deleteWorker(payload.worker),
)

const saveBuilding = createAsyncThunk(
  `${ reduxKey }/saveBuilding`,
  (payload: { building: TownBuilding }) => GameApi.createOrUpdateBuilding(payload.building),
)

const deleteBuilding = createAsyncThunk(
  `${ reduxKey }/deleteBuilding`,
  (payload: { building: string }) => GameApi.deleteBuilding(payload.building),
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
        const [ game, buildings, products, items ] = action.payload
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
    b = addAsyncCases(b, saveWorker, defaultOnSuccess);
    b = addAsyncCases(b, deleteWorker, defaultOnSuccess);
    b = addAsyncCases(b, saveBuilding, defaultOnSuccess);
    b = addAsyncCases(b, deleteBuilding, defaultOnSuccess);
  }
});


export { getProductionLevel } from './services/get-production-level'

export const { cleanup } = slice.actions;
export { list, saveWorker, deleteWorker, saveBuilding, deleteBuilding };
const game = (state: State) => state.game.game;
export const selectors = {
  loading(state: State) { return state.game.loading },
  listLoaded(state: State) { return state.game.listLoaded },
  game,
  productions(state: State) { return state.game.productions },
  tools(state: State) { return state.game.items },
  rawBuildingById(state: State) {
    return state.game.buildings.reduce<{ [ id: string ]: Building }>((acc, c) => ({ ...acc, [ c.id ]: c }), {});
  },
  buildingsByCategory(state: State) {
    return state.game.game.buildings.reduce((acc, c) => {
      const building = state.game.buildings.find(b => b.id === c.buildingId);
      if (building) {
        return { ...acc, [ building.category.valueOf() ]: [ ...acc[ building.category.valueOf() ], c ] };
      }
      return acc;
    }, {
      [ BuildingKind.House.valueOf() ]: [] as Array<EnrichedTownBuilding>,
      [ BuildingKind.Extraction.valueOf() ]: [] as Array<EnrichedTownBuilding>,
      [ BuildingKind.Hunting.valueOf() ]: [] as Array<EnrichedTownBuilding>,
      [ BuildingKind.Farming.valueOf() ]: [] as Array<EnrichedTownBuilding>,
      [ BuildingKind.AnimalHusbandry.valueOf() ]: [] as Array<EnrichedTownBuilding>,
      [ BuildingKind.Production.valueOf() ]: [] as Array<EnrichedTownBuilding>,
      [ BuildingKind.Service.valueOf() ]: [] as Array<EnrichedTownBuilding>,
      [ BuildingKind.Storage.valueOf() ]: [] as Array<EnrichedTownBuilding>,
    })
  },
  summary(state: State) { return services.dailySummary(state.game.game, state.game.buildings, state.game.productions, state.game.items)}
}

export default slice.reducer;
