import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type Toast = { open: boolean; message?: string; severity?: "success" | "info" | "warning" | "error" };

type UIState = {
  drawerOpen: boolean;
  toast: Toast;
};

const initialState: UIState = {
  drawerOpen: true,
  toast: { open: false, message: "", severity: "info" },
};

const slice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setDrawerOpen(state, action: PayloadAction<boolean>) {
      state.drawerOpen = action.payload;
    },
    showToast(state, action: PayloadAction<{ message: string; severity?: Toast["severity"] }>) {
      state.toast = { open: true, message: action.payload.message, severity: action.payload.severity ?? "info" };
    },
    hideToast(state) {
      state.toast.open = false;
    },
  },
});

export const { setDrawerOpen, showToast, hideToast } = slice.actions;

export const selectUI = (state: any) => state.ui;

export default slice.reducer;
