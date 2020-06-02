export const RESET_FEED = "feeds/RESET_FEED";
export const SET_ISCHANGED = "feeds/SET_ISCHANGED";
export const TOGGLE_VISIBILITY = "feeds/TOGGLE_VISIBILITY";

export const ADD_FEED = "feeds/ADD_FEED";
export const FAILD_LOAD_FEED = "feeds/FAILD_LOAD_FEED";
export const EDIT_FEED_TITEL = "feeds/EDIT_FEED_TITEL";
export const DELETE_FEED = "feeds/DELETE_FEED";
export const MOVE_FEED_ITEM = "feeds/MOVE_FEED_ITEM";

export const ADD_COLLECTION = "feeds/ADD_COLLECTION";
export const DELETE_COLLECTION = "feeds/DELETE_COLLECTION";
export const EDIT_COLLECTION_TITLE = "feeds/EDIT_COLLECTION_TITLE";
export const MOVE_FEED_COLLECTION = "feeds/MOVE_FEED_COLLECTION";

export type FeedTargetType = "feed" | "collection";
export interface FeedForAdd {
  title: string;
  siteUrl: string;
  feedUrl: string;
  collectionID: string | null | undefined;
}

export interface Feed extends FeedForAdd {
  id: string;
  visibility: boolean;
  faildCount: number;
}

export interface FeedItem {
  title: string;
  description: string;
  pubDate: string;
  siteUrl: string;
  siteTitle: string;
  postUrl: string;
}

export interface Collection {
  id: string;
  title: string;
  visibility: boolean;
}

export interface FeedsState {
  loaded: boolean;
  feeds: Feed[];
  collections: Collection[];
  isChanged: boolean;
}

// action types

interface AddFeedAction {
  type: typeof ADD_FEED;
  payload: FeedForAdd;
}

interface FaildLoadFeedAction {
  type: typeof FAILD_LOAD_FEED;
  id: string;
}

interface ResetFeedsAction {
  type: typeof RESET_FEED;
  state: FeedsState;
}

interface SetIsChangedAction {
  type: typeof SET_ISCHANGED;
  isChanged: boolean;
}

interface AddCollectionAction {
  type: typeof ADD_COLLECTION;
}

interface DeleteCollectionAction {
  type: typeof DELETE_COLLECTION;
  id: string;
}

interface EditCollectionTitleAction {
  type: typeof EDIT_COLLECTION_TITLE;
  id: string;
  title: string;
}

interface ToggleVisibilityAction {
  type: typeof TOGGLE_VISIBILITY;
  id: string;
  targetType: FeedTargetType;
}

interface EditFeedTitleAction {
  type: typeof EDIT_FEED_TITEL;
  id: string;
  title: string;
}

interface DeleteFeedAction {
  type: typeof DELETE_FEED;
  id: string;
}

interface MoveFeedITemAction {
  type: typeof MOVE_FEED_ITEM;
  dropCollectionID: string;
  dragFeedID: string;
  dropIndex: number;
}

interface MoveFeedCollectionAction {
  type: typeof MOVE_FEED_COLLECTION;
  dragCollectionID: string;
  dropIndex: number;
}

export type FeedActionType =
  | MoveFeedCollectionAction
  | MoveFeedITemAction
  | DeleteFeedAction
  | EditFeedTitleAction
  | ToggleVisibilityAction
  | DeleteCollectionAction
  | EditCollectionTitleAction
  | AddCollectionAction
  | SetIsChangedAction
  | ResetFeedsAction
  | AddFeedAction
  | FaildLoadFeedAction;

const resetFeeds = (state: FeedsState) => {
  return { type: RESET_FEED, state };
};

const addFeed = (payload: FeedForAdd) => {
  return { type: ADD_FEED, payload };
};

const addCollection = () => {
  return { type: ADD_COLLECTION };
};

const faildLoadFeed = (id: string) => {
  return { type: FAILD_LOAD_FEED, id };
};

const setIsChanged = (isChanged: boolean) => {
  return { type: SET_ISCHANGED, isChanged };
};

const deleteCollection = (id: string) => {
  return { type: DELETE_COLLECTION, id };
};

const editTitleCollection = (id: string, title: string) => {
  return { type: EDIT_COLLECTION_TITLE, id, title };
};

const toggleVisibility = (id: string, targetType: FeedTargetType) => {
  return { type: TOGGLE_VISIBILITY, id, targetType };
};

const editFeedTitle = (id: string, title: string) => {
  return { type: EDIT_FEED_TITEL, id, title };
};

const deleteFeed = (id: string) => {
  return { type: DELETE_FEED, id };
};

const moveFeedItem = (dropCollectionID: string, dragFeedID: string, dropIndex: number) => {
  return { type: MOVE_FEED_ITEM, dropCollectionID, dragFeedID, dropIndex };
};

const moveFeedCollection = (dragCollectionID: string, dropIndex: number) => {
  return { type: MOVE_FEED_COLLECTION, dragCollectionID, dropIndex };
};

export const actionCreators = {
  addFeed,
  faildLoadFeed,
  resetFeeds,
  setIsChanged,
  deleteCollection,
  editTitleCollection,
  toggleVisibility,
  addCollection,
  editFeedTitle,
  deleteFeed,
  moveFeedItem,
  moveFeedCollection,
};
