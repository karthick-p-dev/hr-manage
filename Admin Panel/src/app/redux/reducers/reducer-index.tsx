import { combineReducers } from "redux";
import { signReducer } from "./loginReducer";
import { dashReducer } from "./dashboardReducer";

const Reducers = combineReducers({
  signReducer,
  dashReducer,
});
export type ApplicationState = ReturnType<typeof Reducers>;

export default Reducers;
