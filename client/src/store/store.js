import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userSliceReducer from "./user/userSlice";
import { persistReducer, persistStore, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";

const expireTransform = createTransform(
  (inboundState, key) => {
    return { ...inboundState, _persistedAt: Date.now() };
  },
  (outboundState, key) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const now = Date.now();
    if (
      outboundState._persistedAt &&
      now - outboundState._persistedAt > oneDay
    ) {
      // State is expired, return undefined to remove it
      return undefined;
    }
    // State is not expired, return it as is
    return outboundState;
  },
  { whitelist: ["userSlice"] }
);

const rootReducer = combineReducers({
  userSlice: userSliceReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  transforms: [expireTransform],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
