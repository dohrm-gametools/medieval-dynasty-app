import { ActionReducerMapBuilder, AsyncThunk, CaseReducer, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State as I18nState } from '~/src/app/i18n';
import {
  Building,
  BuildingKind,
  BuildingsApi,
  GameApi,
  GameDetails,
  Item,
  ItemsApi,
  Production,
  ProductionsApi,
  TownBuilding,
  Worker,
} from '~/src/api';
import { dailySummary } from './services/daily-summary';

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
  game: GameDetails,
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
        state.game = game;
      })
    b = addAsyncCases(b, saveWorker, (state, action) => {
      state.loading = false;
      state.game = action.payload;
    });
    b = addAsyncCases(b, deleteWorker, (state, action) => {
      state.loading = false;
      state.game = action.payload;
    });
    b = addAsyncCases(b, saveBuilding, (state, action) => {
      state.loading = false;
      state.game = action.payload;
    });
    b = addAsyncCases(b, deleteBuilding, (state, action) => {
      state.loading = false;
      state.game = action.payload;
    });
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
      [ BuildingKind.House.valueOf() ]: [] as Array<TownBuilding>,
      [ BuildingKind.Extraction.valueOf() ]: [] as Array<TownBuilding>,
      [ BuildingKind.Hunting.valueOf() ]: [] as Array<TownBuilding>,
      [ BuildingKind.Farming.valueOf() ]: [] as Array<TownBuilding>,
      [ BuildingKind.AnimalHusbandry.valueOf() ]: [] as Array<TownBuilding>,
      [ BuildingKind.Production.valueOf() ]: [] as Array<TownBuilding>,
      [ BuildingKind.Service.valueOf() ]: [] as Array<TownBuilding>,
      [ BuildingKind.Storage.valueOf() ]: [] as Array<TownBuilding>,
    })
  },
  summary(state: State) { return dailySummary(state.game.game, state.game.buildings, state.game.productions, state.game.items)}
}

export default slice.reducer;
