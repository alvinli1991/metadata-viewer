import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DagMenus, DagMenuInfo } from "@/app/lib/data/dag/definition";
import axios from "axios";
import { dagMenus } from "@/app/lib/data/dag/menu-data";

export const menuSlice = createSlice({
  name: "menus",
  initialState: {
    status: "idle" as "idle" | "loading" | "succeeded" | "failed",
    error: null as string | null | undefined,
    menus: dagMenus as DagMenus,
    activeMenu: undefined as DagMenuInfo | undefined,
  },
  reducers: {
    clearMenus: (state) => {
      (state.menus = []), (state.activeMenu = undefined);
    },
    chooseMenu: (state, action) => {
      let project = action.payload.project;
      let dagId = action.payload.dagId;
      state.activeMenu = state.menus
        ?.find((menu) => menu.project === project)
        ?.dags?.find((dag) => dag.id === dagId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenus.fulfilled, (state, action) => {
        state.menus = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchMenus.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchMenus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const fetchMenus = createAsyncThunk(
  "menus/fetchMenus",
  async ({ port }: { port: number }) => {
    const url = `http://127.0.0.1:${port}/api.dag`;
    const response = await axios.get(url, {
      params: {
        func: "GET_DAG_FILE_META",
      },
    });
    return response.data;
  }
);

export const selectMenusStatus = (state: any) => state.menus.status;
export const selectMenusError = (state: any) => state.menus.error;
export const selectMenus = (state: any) => state.menus.menus;
export const selectActiveMenu = (state: any) => state.menus.activeMenu;

export const { clearMenus, chooseMenu } = menuSlice.actions;
export default menuSlice.reducer;
