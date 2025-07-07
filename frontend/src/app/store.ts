import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/theme/themeSlice";
import customerStatsReducer from "../features/customer/customerStatsSlice";
import adminReducer from '../features/admin/adminSlice'


export const store = configureStore({
  reducer: {
    theme: themeReducer,
    customerStats: customerStatsReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
