import { combineReducers } from "redux";
import tabs from "../modules/tabs/reducer";
import feeds from "../modules/feeds/reducer";
import global from "../modules/global/reducer";

const rootReducer = combineReducers({ global, tabs, feeds });

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
