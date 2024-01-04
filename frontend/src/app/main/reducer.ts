import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GameApi } from '~/src/api';
import { getRandomName } from '~/src/api/name-generator';


export const reduxKey = 'main';

const list = createAsyncThunk(
  `${reduxKey}/list`,
  async () => {
    const current = await GameApi.current();
    const games = GameApi.listGames();
    return { current: current.id, games };
  }
)

const change = createAsyncThunk(
  `${reduxKey}/change`,
  async (payload: { id: string }) => {
    await GameApi.change(payload.id);
    const current = await GameApi.current();
    const games = GameApi.listGames();
    return { current: current.id, games };
  }
)

const add = createAsyncThunk(
  `${reduxKey}/add`,
  async (payload: { id?: string, name?: string }) => {
    if (payload.id && payload.id !== '') {
      GameApi.addGame(payload.id, payload.name || '');
      return GameApi.listGames();
    } else {
      await GameApi.create(payload.name || '');
      return GameApi.listGames();
    }
  }
)

const remove = createAsyncThunk(
  `${reduxKey}/remove`,
  async (id: string) => {
    await GameApi.remove(id)
    return GameApi.listGames();
  }
)

export interface MainState {
  loaded: boolean;
  loading: boolean;
  game: string;
  games: Array<{ id: string, name: string }>;
}

export interface State {
  main: MainState;
}

const initialState: MainState = {
  loaded: false,
  loading: false,
  game: '',
  games: [],
}

const slice = createSlice({
  name: reduxKey,
  initialState,
  reducers: {},
  extraReducers: builder => {
    return builder
      .addCase(list.pending, (state) => {
        state.loaded = false;
      })
      .addCase(list.fulfilled, (state, action) => {
        const { current, games } = action.payload;
        state.loaded = true;
        state.game = current;
        state.games = games;
      })
      .addCase(change.fulfilled, (state, action) => {
        const { current, games } = action.payload;
        state.game = current;
        state.games = games;
      })
      .addCase(add.fulfilled, (state, action) => {
        state.games = action.payload;
      })
      .addCase(remove.fulfilled, (state, action) => {
        state.games = action.payload;
      })
  }
})

export { list, change, add, remove };
export default slice.reducer;

export const selectors = {
  game(state: State) { return state.main.game},
  games(state: State) { return state.main.games},
}
