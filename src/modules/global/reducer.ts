import {
  WindowItem,
  LinkMethod,
  ReloadPostsHour,
  DragData,
  DragMoveData,
  DropData,
  GlobalActionTypes,
  SET_WINDOW,
  RESET_GLOBAL,
  SET_DRAG_DATA,
  CLEAR_DRAG_DATA,
  SET_DROP_DATA,
  CLEAR_DROP_DATA,
  HidePostsDay,
} from "./actions";

export interface GlobalState {
  window: WindowItem;
  drag: DragData | DragMoveData | null;
  drop: DropData | null;
  linkMethod: {
    tab: LinkMethod;
    collection: LinkMethod;
    post: LinkMethod;
    feed: LinkMethod;
  };
  reloadPosts: ReloadPostsHour;
  hidePosts: HidePostsDay;
}

const initialState: GlobalState = {
  window: "default",
  drag: null,
  drop: null,
  linkMethod: {
    tab: "current",
    collection: "new",
    feed: "new",
    post: "new",
  },
  reloadPosts: 6,
  hidePosts: 0,
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
        drag: action.state,
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
