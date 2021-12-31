import { ActionReducerMapBuilder, AsyncThunk, AsyncThunkAction, CaseReducer, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State as I18nState } from '~/src/app/i18n';
import { GameApi, GameInList, GameDetails, Worker } from '~/src/api';
import one = GameApi.one;

export const reduxKey = 'games';
const list = createAsyncThunk(
  `${ reduxKey }/list`,
  () => GameApi.list(),
);

const select = createAsyncThunk(
  `${ reduxKey }/select`,
  (id: string) => GameApi.one(id),
)

const create = createAsyncThunk(
  `${ reduxKey }/create`,
  (name: string) => GameApi.create(name),
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
  games: Array<GameInList>;
  gameSelected?: GameDetails;
  error?: string;
}

export interface State extends I18nState {
  games: SliceState;
}

const initialState: SliceState = {
  listLoaded: false,
  loading: true,
  games: [],
  gameSelected: undefined,
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
    },
    unselect(state) {
      state.gameSelected = undefined;
    }
  },
  extraReducers: builder => {
    let b = builder
    .addCase(list.pending, (state) => {
      state.listLoaded = false;
    })
    .addCase(list.fulfilled, (state, action) => {
      state.listLoaded = true;
      state.games = action.payload;
    })
    b = addAsyncCases(b, select, (state, action) => {
      state.loading = false;
      state.gameSelected = action.payload;
    })
    b = addAsyncCases(b, create, (state, action) => {
      state.loading = false;
      state.games = [ ...state.games, action.payload ];
      state.gameSelected = action.payload;
    })
    b = addAsyncCases(b, saveWorker, (state, action) => {
      state.loading = false;
      state.gameSelected = action.payload;
    });
    b = addAsyncCases(b, deleteWorker, (state, action) => {
      state.loading = false;
      state.gameSelected = action.payload;
    });
  }
});


export const { unselect, cleanup } = slice.actions;
export { list, select, create, saveWorker, deleteWorker }
const gameSelected = (state: State) => state.games.gameSelected;
export const selectors = {
  loading(state: State) { return state.games.loading },
  listLoaded(state: State) { return state.games.listLoaded },
  games(state: State) { return state.games.games },
  gameSelected,
}

export default slice.reducer;
