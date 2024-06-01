import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import logger from "redux-logger";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import rootReducer from "../reducers/reducer-index";

const persistConfig = {
  key: "root",
  storage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk, logger)));
export const persistor = persistStore(store);
