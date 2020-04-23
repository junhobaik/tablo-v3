import {
  WindowItem,
  GlobalActionTypes,
  SET_WINDOW,
  RESET_GLOBAL,
} from "./actions";

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
    case RESET_GLOBAL:
      return action.state ?? state;
    default:
      return state;
  }
}

export default globalReducer;
