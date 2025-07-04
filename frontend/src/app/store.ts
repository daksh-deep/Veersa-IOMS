import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/theme/themeSlice";
import customerStatsReducer from "../features/customer/customerStatsSlice";


export const store = configureStore({
  reducer: {
    theme: themeReducer,
    customerStats: customerStatsReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
