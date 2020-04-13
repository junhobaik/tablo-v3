import { WindowItem, GlobalActionTypes, SET_WINDOW } from "./actions";

export interface GlobalState {
  window: WindowItem;
}

const initialState: GlobalState = {
  window: "default",
};

function globalReducer(
  state = initialState,
  action: GlobalActionTypes
): GlobalState {
  switch (action.type) {
    case SET_WINDOW:
      return {
        ...state,
        window: action.window,
      };
    default:
      return state;
  }
}

export default globalReducer;
