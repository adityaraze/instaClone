import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import socketSlice from "./socketSlice";
import postSlice from "./postSlice";
import chatSlice from "./chatSlice";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import rtnSlice from "./rtnSlice";
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};
const rootReducer = combineReducers({
    auth:authSlice,
    post:postSlice,
    socketio:socketSlice,
    chat:chatSlice,
    realTimeNotification:rtnSlice
})
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
