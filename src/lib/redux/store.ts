import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@/services/api';
import authReducer from '@/lib/redux/slices/authSlice';
import uiReducer from '@/lib/redux/slices/uiSlice';
import { authApiSlice } from '@/services/apiAuth';
import { categoryApi } from '@/services/apiCategory';
import { mangaApi } from '@/services/apiManga';

// Fixed reducer mapping - each API needs its own reducer path
const rootReducer = {
  auth: authReducer,
  ui: uiReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
  [authApiSlice.reducerPath]: authApiSlice.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [mangaApi.reducerPath]: mangaApi.reducer // Add this line
};

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    // Add middleware in a type-safe way
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(apiSlice.middleware)
        .concat(authApiSlice.middleware)
        .concat(categoryApi.middleware)
        .concat(mangaApi.middleware) // Add this line
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
