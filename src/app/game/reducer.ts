import { ActionReducerMapBuilder, AsyncThunk, CaseReducer, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State as I18nState } from '~/src/app/i18n';
import {
  Building,
  BuildingKind,
  BuildingsApi,
  GameApi,
  GameDetails,
  GameDetailsDraft,
  Production,
  ProductionsApi,
  ItemsApi,
  TownBuilding,
  Worker,
  Item,
} from '~/src/api';
import { Kind } from '~/src/api/buildings';

export const reduxKey = 'game';
const list = createAsyncThunk(
  `${ reduxKey }/list`,
  () => {
    return Promise.all([
        GameApi.list(),
        BuildingsApi.fetchAll(),
        ProductionsApi.fetchAll(),
        ItemsApi.fetchTools(),
      ]
    )
  },
);

const select = createAsyncThunk(
  `${ reduxKey }/select`,
  (id: string) => GameApi.one(id),
)

//
const saveWorker = createAsyncThunk(
  `${ reduxKey }/saveWorker`,
  (payload: { game: string, worker: Worker }) => GameApi.createOrUpdateWorker(payload.game, payload.worker),
)

const deleteWorker = createAsyncThunk(
  `${ reduxKey }/deleteWorker`,
  (payload: { game: string, worker: string }) => GameApi.deleteWorker(payload.game, payload.worker),
)

const saveBuilding = createAsyncThunk(
  `${ reduxKey }/saveBuilding`,
  (payload: { game: string, building: TownBuilding }) => GameApi.createOrUpdateBuilding(payload.game, payload.building),
)

const deleteBuilding = createAsyncThunk(
  `${ reduxKey }/deleteBuilding`,
  (payload: { game: string, building: string }) => GameApi.deleteBuilding(payload.game, payload.building),
)
//
// const updateWorker = createAsyncThunk(
//   `${ reduxKey }/updateWorker`,
//   (worker: Worker) => null,
// )
//
// const addBuilding = createAsyncThunk(
//   `${ reduxKey }/addBuilding`,
//   (buildingId: string) => null
// )
//
// const changeBuildingAssignment = createAsyncThunk(
//   `${ reduxKey }/changeBuildingAssignment`,
//   (payload: { building: string, worker: string, action: 'add' | 'remove' }) => null
// )
//
// const changeProductionRate = createAsyncThunk(
//   `${ reduxKey }/changeProductionRate`,
//   (payload: { recipe: number, rate: number }) => null
// )

export interface SliceState {
  listLoaded: boolean;
  loading: boolean;
  game: GameDetails;
  history: Array<GameDetails>;
  buildings: Array<Building>;
  productions: Array<Production>;
  tools: Array<Item>;
  error?: string;
}

export interface State extends I18nState {
  game: SliceState;
}

const initialState: SliceState = {
  listLoaded: false,
  loading: false,
  game: GameDetailsDraft,
  history: [],
  buildings: [],
  productions: [],
  tools: [],
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
        const [ games, buildings, products, tools ] = action.payload
        state.listLoaded = true;
        const game = games.find(d => !d.archived);
        const history = games.filter(d => d.archived);
        if (!game) {
          // Should not append ...
          state.error = 'something wrong appends';
          return;
        }
        state.buildings = buildings;
        state.productions = products;
        state.tools = tools;
        state.game = game;
        state.history = history;
      })
    b = addAsyncCases(b, select, (state, action) => {
      state.loading = false;
      state.game = action.payload;
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


export function getProductionLevel(building: Building, workers: Array<string>, game: GameDetails): number | undefined {
  const skill = building.workerSkill;
  if (!skill) return undefined;
  return workers.reduce((acc, c) => {
    const w = game.workers.find(w => w.id === c)
    if (!w) return acc;
    return acc + w.skills[ skill ];
  }, 0);
}

export const { cleanup } = slice.actions;
export { list, select, saveWorker, deleteWorker, saveBuilding, deleteBuilding };
const game = (state: State) => state.game.game;
export const selectors = {
  loading(state: State) { return state.game.loading },
  listLoaded(state: State) { return state.game.listLoaded },
  history(state: State) { return state.game.history },
  game,
  productions(state: State) { return state.game.productions },
  tools(state: State) { return state.game.tools },
  rawBuildingById(state: State) {
    return state.game.buildings.reduce<{ [ id: string ]: Building }>((acc, c) => ({ ...acc, [ c.id ]: c }), {});
  },
  buildingsByCategory(state: State) {
    return game(state).buildings.reduce((acc, c) => {
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
  }
}

export default slice.reducer;
