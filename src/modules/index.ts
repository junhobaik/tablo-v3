import { combineReducers } from "redux";
import tabs from "../modules/tabs/reducer";
import global from "../modules/global/reducer";

const rootReducer = combineReducers({ tabs, global });

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
