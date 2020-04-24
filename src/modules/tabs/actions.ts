import { TabsState } from "./reducer";

export const ADD_TAB_ITEM = "tabs/ADD_TAB_ITEM";
export const DELETE_TAB_ITEM = "tabs/DELETE_TAB_ITEM";
export const RESET_TABS = "tabs/RESET_TABS";
export const SET_FOLDED_COLLECTION = "tabs/SET_FOLDED_COLLECTION";

export interface CollectionItem {
  id: string;
  title: string;
  folded: boolean;
}
export interface TabItem {
  id: string;
  title: string;
  description: string;
  url: string;
  collection: string;
}

interface AddTabItemAction {
  type: typeof ADD_TAB_ITEM;
  payload: TabItem;
}

interface DeleteTabItemAction {
  type: typeof DELETE_TAB_ITEM;
  id: string;
}

interface ResetTabsAction {
  type: typeof RESET_TABS;
  state: TabsState;
}

interface SetFoldedCollectionAction {
  type: typeof SET_FOLDED_COLLECTION;
  id: string;
}

export type TabActionTypes =
  | AddTabItemAction
  | DeleteTabItemAction
  | ResetTabsAction
  | SetFoldedCollectionAction;

const addTabItem = (title: string) => {
  return { type: ADD_TAB_ITEM, payload: { title } };
};

const deleteTabItem = (id: string) => {
  return { type: DELETE_TAB_ITEM, id };
};

const resetTabs = (state: TabsState) => {
  return { type: RESET_TABS, state };
};

const setFoldedCollection = (id: string) => {
  return { type: SET_FOLDED_COLLECTION, id };
};

export const actionCreators = {
  addTabItem,
  deleteTabItem,
  resetTabs,
  setFoldedCollection,
};
