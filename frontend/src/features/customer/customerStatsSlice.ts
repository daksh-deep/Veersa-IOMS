import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CustomerStatsState {
    activeCount : number;
}

const initialState: CustomerStatsState = {
  activeCount: 0,
};

const customerStatsSlice = createSlice({
  name: "customerStats",
  initialState,
  reducers: {
    setActiveCount: (state, action: PayloadAction<number>) => {
      state.activeCount = action.payload;
    },
  },
});

export const { setActiveCount } = customerStatsSlice.actions;
export default customerStatsSlice.reducer;