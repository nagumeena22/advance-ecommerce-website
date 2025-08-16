import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./slices/sidebarSlice";
import cartReducer, { cartMiddleware } from "./slices/cartSlice";

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartMiddleware),
});
