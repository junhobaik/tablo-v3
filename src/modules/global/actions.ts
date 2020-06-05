import { GlobalState } from "./reducer";

export const SET_WINDOW = "global/SET_WINDOW";
export const RESET_GLOBAL = "global/RESET_GLOBAL";
export const SET_DRAG_DATA = "global/SET_DRAG_DATA";
export const CLEAR_DRAG_DATA = "global/CLEAR_DRAG_DATA";
export const SET_DROP_DATA = "global/SET_DROP_DATA";
export const CLEAR_DROP_DATA = "global/CLEAR_DROP_DATA";

export type WindowItem = "default" | "tabs-setting" | "feeds-setting";
type DragDataFrom = "tabs-setting" | "feeds" | "feed-post";
type DragMoveDataFrom =
  | "collection"
  | "tabs"
  | "feeds-setting-feed"
  | "feeds-setting-collection";
export type LinkMethod = "new" | "current" | null | undefined;
export type ReloadPostsHour = 3 | 6 | 9 | 12 | 24;
export type HidePostsDay = 0 | 7 | 14 | 30 | 60 | 90;

export interface DragData {
  from: DragDataFrom;
  title: string;
  url: string;
  description: string;
}

export interface DragMoveData {
  type: DragMoveDataFrom;
  id: string;
}

export interface DropData {
  collection: string;
  index: number;
}

interface SetWindowAction {
  type: typeof SET_WINDOW;
  window: WindowItem;
}

interface ResetGlobalAction {
  type: typeof RESET_GLOBAL;
  state: GlobalState;
}

interface SetDragData {
  type: typeof SET_DRAG_DATA;
  state: DragData;
}

interface ClearDargData {
  type: typeof CLEAR_DRAG_DATA;
}

interface SetDropData {
  type: typeof SET_DROP_DATA;
  state: DropData;
}

interface ClearDropData {
  type: typeof CLEAR_DROP_DATA;
}

export type GlobalActionTypes =
  | SetWindowAction
  | ResetGlobalAction
  | SetDragData
  | ClearDargData
  | SetDropData
  | ClearDropData;

const setWindow = (window: WindowItem) => {
  return { type: SET_WINDOW, window };
};
const resetGlobal = (state: GlobalState) => {
  return { type: RESET_GLOBAL, state };
};

const setDragData = (state: DragData | DragMoveData) => {
  return { type: SET_DRAG_DATA, state };
};

const clearDragData = () => {
  return { type: CLEAR_DRAG_DATA };
};

const setDropData = (state: DropData) => {
  return { type: SET_DROP_DATA, state };
};

const clearDropData = () => {
  return { type: CLEAR_DROP_DATA };
};

export const actionCreators = {
  setWindow,
  resetGlobal,
  setDragData,
  clearDragData,
  setDropData,
  clearDropData,
};
