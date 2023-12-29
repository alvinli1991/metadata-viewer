import { configureStore } from "@reduxjs/toolkit";
import menusReducer from "@/app/lib/features/dag/menuSlice";
import dagReducer from "@/app/lib/features/dag/dagSlice";
import aliveReducer from "@/app/lib/features/dag/aliveSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      menus: menusReducer,
      dag: dagReducer,
      alive: aliveReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
