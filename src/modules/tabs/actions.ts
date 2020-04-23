import { TabsState } from "./reducer";

export const ADD_TAB_ITEM = "tabs/ADD_TAB_ITEM";
export const RESET_TABS = "tabs/RESET_TABS";

export interface CollectionItem {
  id: string;
  title: string;
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

interface ResetTabsAction {
  type: typeof RESET_TABS;
  state: TabsState;
}

export type TabActionTypes = AddTabItemAction | ResetTabsAction;

const addTabItem = (title: string) => {
  return { type: ADD_TAB_ITEM, payload: { title } };
};

const resetTabs = (state: TabsState) => {
  return { type: RESET_TABS, state };
};

export const actionCreators = {
  addTabItem,
  resetTabs,
};
