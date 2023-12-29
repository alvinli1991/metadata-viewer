import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { HttpStatusCode } from "axios";

export const aliveSlice = createSlice({
  name: "alive",
  initialState: {
    status: "idle" as "idle" | "loading" | "succeeded" | "failed",
    error: null as string | null | undefined,
    port: 63342 as number,
    alive: false as true | false,
    syncAction: true as true | false,
  },
  reducers: {
    setPort: (state, action) => {
      state.port = action.payload;
    },
    setSyncAction(state, action) {
      state.syncAction = action.payload;
    },
    resetAliveStatus(state) {
      state.status = "idle";
      state.alive = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlive.fulfilled, (state, action) => {
        state.alive = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchAlive.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchAlive.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const fetchAlive = createAsyncThunk(
  "alive/fetchAlive",
  async ({ port }: { port: number }) => {
    const url = `http://127.0.0.1:${port}/api.dag`;
    const response = await axios.get(url, {
      params: {
        func: "ALIVE",
      },
    });
    return response.status === HttpStatusCode.Ok;
  }
);

export const selectAlive = (state: any) => state.alive.alive;
export const selectAlivePort = (state: any) => state.alive.port;
export const selectAliveStatus = (state: any) => state.alive.status;
export const selectAliveError = (state: any) => state.alive.error;
export const selectAliveSyncAction = (state: any) => state.alive.syncAction;

export const { setPort, setSyncAction, resetAliveStatus } = aliveSlice.actions;
export default aliveSlice.reducer;
