import { TabsState } from './reducer';

export const ADD_TAB_ITEM = 'tabs/ADD_TAB_ITEM';
export const DELETE_TAB_ITEM = 'tabs/DELETE_TAB_ITEM';
export const DELETE_COLLECTION = 'tabs/DELETE_COLLECTION';
export const RESET_TABS = 'tabs/RESET_TABS';
export const SET_FOLDED_COLLECTION = 'tabs/SET_FOLDED_COLLECTION';
export const EDIT_TAB_ITEM_TITLE = 'tabs/EDIT_TAB_ITEM_TITLE';
export const EDIT_TAB_ITEM_DESCRIPTION = 'tabs/EDIT_TAB_ITEM_DESCRIPTION';
export const ADD_COLLECTION = 'tabs/ADD_COLLECTION';
export const TABS_ARCHIVE = 'tabs/TABS_ARCHIVE';
export const EDIT_COLLECTION_TITLE = 'tabs/EDIT_COLLECTION_TITLE';
export const MOVE_COLLECTION = 'tabs/MOVE_COLLECTION';
export const MOVE_TAB_ITEM = 'tabs/MOVE_TAB_ITEM';
export const EMPTY_CART = 'tabs/EMPTY_CART';
export const DELETE_CART_ITEM = 'tabs/DELETE_CART_ITEM';

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

export interface AddTabItem {
  index: number | null;
  title: string;
  description: string;
  url: string;
  collection: string;
}

export interface SimpleItem {
  title: string;
  url: string;
}

// Action Types

interface AddCollectionAction {
  type: typeof ADD_COLLECTION;
}
interface AddTabItemAction {
  type: typeof ADD_TAB_ITEM;
  state: AddTabItem;
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

interface EditTabItemTitle {
  type: typeof EDIT_TAB_ITEM_TITLE;
  id: string;
  title: string;
}

interface EditTabItemDescription {
  type: typeof EDIT_TAB_ITEM_DESCRIPTION;
  id: string;
  description: string;
}

interface TabsArchiveAction {
  type: typeof TABS_ARCHIVE;
  items: SimpleItem[];
}

interface DeleteCollectionAction {
  type: typeof DELETE_COLLECTION;
  collectionID: string;
}

interface EditCollectionTitle {
  type: typeof EDIT_COLLECTION_TITLE;
  title: string;
  id: string;
}

interface MoveCollectionAction {
  type: typeof MOVE_COLLECTION;
  id: string;
  index: number;
}

interface MoveTabItemAction {
  type: typeof MOVE_TAB_ITEM;
  dropCollectionID: string;
  dragItemID: string;
  dropIndex: number;
}

interface EmptyCartAction {
  type: typeof EMPTY_CART;
}

interface DeleteCartItemAction {
  type: typeof DELETE_CART_ITEM;
  url: string;
}

export type TabsActionTypes =
  | DeleteCartItemAction
  | EmptyCartAction
  | MoveTabItemAction
  | MoveCollectionAction
  | EditCollectionTitle
  | DeleteCollectionAction
  | AddTabItemAction
  | DeleteTabItemAction
  | ResetTabsAction
  | SetFoldedCollectionAction
  | EditTabItemTitle
  | EditTabItemDescription
  | AddCollectionAction
  | TabsArchiveAction;

const addCollection = () => {
  return { type: ADD_COLLECTION };
};

const addTabItem = (state: AddTabItem) => {
  return { type: ADD_TAB_ITEM, state };
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

const editCollectionTitle = (id: string, title: string) => {
  return { type: EDIT_COLLECTION_TITLE, id, title };
};
const editTabItemTitle = (id: string, title: string) => {
  return { type: EDIT_TAB_ITEM_TITLE, id, title };
};

const editTabItemDescription = (id: string, description: string) => {
  return { type: EDIT_TAB_ITEM_DESCRIPTION, id, description };
};

const tabsArchive = (items: SimpleItem[]) => {
  return { type: TABS_ARCHIVE, items };
};

const deleteCollection = (collectionID: string) => {
  return { type: DELETE_COLLECTION, collectionID };
};

const moveCollection = (id: string, index: number) => {
  return { type: MOVE_COLLECTION, id, index };
};

const moveTabItem = (dropCollectionID: string, dragItemID: string, dropIndex: number) => {
  return { type: MOVE_TAB_ITEM, dropCollectionID, dragItemID, dropIndex };
};

const emptyCart = () => {
  return { type: EMPTY_CART };
};

const deleteCartItem = (url: string) => {
  return { type: DELETE_CART_ITEM, url };
};

export const actionCreators = {
  moveCollection,
  moveTabItem,
  addTabItem,
  deleteTabItem,
  resetTabs,
  setFoldedCollection,
  editTabItemTitle,
  editTabItemDescription,
  addCollection,
  tabsArchive,
  deleteCollection,
  editCollectionTitle,
  emptyCart,
  deleteCartItem,
};
