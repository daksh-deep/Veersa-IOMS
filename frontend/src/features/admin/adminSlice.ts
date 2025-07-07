import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Admin {
  adminName: string;
}

const initialState: Admin = {
  adminName: "Admin",
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminName: (state, action: PayloadAction<string>) => {
      state.adminName = action.payload;
    },
  },
});

export const { setAdminName } = adminSlice.actions;
export default adminSlice.reducer;
