import { combineReducers } from "redux";
import tabs from "../modules/tabs/reducer";

const rootReducer = combineReducers({ tabs });

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
