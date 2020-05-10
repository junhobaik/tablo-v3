import {
  WindowItem,
  DragData,
  DropData,
  GlobalActionTypes,
  SET_WINDOW,
  RESET_GLOBAL,
  SET_DRAG_DATA,
  CLEAR_DRAG_DATA,
  SET_DROP_DATA,
  CLEAR_DROP_DATA,
} from "./actions";

export interface GlobalState {
  window: WindowItem;
  drag: DragData | null;
  drop: DropData | null;
}

const initialState: GlobalState = {
  window: "default",
  drag: null,
  drop: null,
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

    case SET_DRAG_DATA: {
      return {
        ...state,
        drag: {
          from: action.state.from,
          title: action.state.title,
          url: action.state.url,
        },
      };
    }

    case CLEAR_DRAG_DATA:
      return { ...state, drag: null };

    case SET_DROP_DATA: {
      return {
        ...state,
        drop: {
          collection: action.state.collection,
          index: action.state.index,
        },
      };
    }

    case CLEAR_DROP_DATA:
      return { ...state, drop: null };

    default:
      return state;
  }
}

export default globalReducer;
