export const SET_WINDOW = "global/SET_WINDOW";

export type WindowItem = "default" | "tabs-setting" | "feeds-setting";

interface SetWindowAction {
  type: typeof SET_WINDOW;
  window: WindowItem;
}

export type GlobalActionTypes = SetWindowAction;

const setWindow = (window: WindowItem) => {
  return { type: SET_WINDOW, window };
};

export const actionCreators = {
  setWindow,
};
