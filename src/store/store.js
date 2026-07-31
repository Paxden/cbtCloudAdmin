/**
 * Redux Store Configuration
 * Centralized state management
 */

import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

// Import reducers
import authReducer from "./features/auth/authSlice";
import uiReducer from "./features/ui/uiSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  // user: userReducer, // Will be added later
  // questionBank: questionBankReducer, // Will be added later
  // settings: settingsReducer, // Will be added later
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
  devTools: import.meta.env.VITE_APP_ENV !== "production",
});

export default store;
