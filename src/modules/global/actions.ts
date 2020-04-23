import { GlobalState } from "./reducer";

export const SET_WINDOW = "global/SET_WINDOW";
export const RESET_GLOBAL = "global/RESET_GLOBAL";

export type WindowItem = "default" | "tabs-setting" | "feeds-setting";

interface SetWindowAction {
  type: typeof SET_WINDOW;
  window: WindowItem;
}

interface ResetGlobalAction {
  type: typeof RESET_GLOBAL;
  state: GlobalState;
}

export type GlobalActionTypes = SetWindowAction | ResetGlobalAction;

const setWindow = (window: WindowItem) => {
  return { type: SET_WINDOW, window };
};
const resetGlobal = (state: GlobalState) => {
  return { type: RESET_GLOBAL, state };
};

export const actionCreators = {
  setWindow,
  resetGlobal,
};
