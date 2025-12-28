import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "@features/products/productsSlice";
import ordersReducer from "@features/orders/ordersSlice";
import uiReducer from "@features/ui/uiSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    orders: ordersReducer,
    ui: uiReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
