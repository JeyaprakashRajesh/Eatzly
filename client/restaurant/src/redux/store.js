import { configureStore } from "@reduxjs/toolkit";
import restaurantReducer from "./reducers/restaurantReducer";
import authReducer from "./reducers/authReducer";

export const store = configureStore({
  reducer: {
    restaurant: restaurantReducer,
    auth: authReducer,
  },
});
