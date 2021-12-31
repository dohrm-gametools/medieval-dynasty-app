import {
  ActionReducerMapBuilder,
  AsyncThunk,
  AsyncThunkAction,
  CaseReducer,
  createAsyncThunk,
  createSlice,
  PayloadAction,
  createSelector
} from '@reduxjs/toolkit';
import { State as I18nState } from '~/src/app/i18n';
import { GameApi, GameDetails, Worker, GameDetailsDraft, BuildingKind, TownBuilding } from '~/src/api';

export const reduxKey = 'game';
const list = createAsyncThunk(
  `${ reduxKey }/list`,
  () => GameApi.list(),
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
      state.listLoaded = true;
      const game = action.payload.find(d => !d.archived);
      const history = action.payload.filter(d => d.archived);
      if (!game) {
        // Should not append ...
        state.error = 'something wrong appends';
        return;
      }
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
  }
});


export const { cleanup } = slice.actions;
export { list, select, saveWorker, deleteWorker }
const game = (state: State) => state.game.game;
export const selectors = {
  loading(state: State) { return state.game.loading },
  listLoaded(state: State) { return state.game.listLoaded },
  history(state: State) { return state.game.history },
  game,
  buildingsByCategory(state: State) {
    return game(state).buildings.reduce((acc, c) => {
      return { ...acc, [ c.building.category.valueOf() ]: [ ...acc[ c.building.category.valueOf() ], c ] }
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
