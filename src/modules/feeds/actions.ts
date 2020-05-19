export const ADD_FEED = "feeds/ADD_FEED";
export const FAILD_LOAD_FEED = "feeds/FAILD_LOAD_FEED";
export const RESET_FEED = "feeds/RESET_FEED";
export const SET_ISCHANGED = "feeds/SET_ISCHANGED";
export const ADD_COLLECTION = "feeds/ADD_COLLECTION";
export const DELETE_COLLECTION = "feeds/DELETE_COLLECTION";
export const EDIT_COLLECTION_TITLE = "feeds/EDIT_COLLECTION_TITLE";
export const TOGGLE_VISIBILITY = "feeds/TOGGLE_VISIBILITY";

export type FeedTargetType = "feed" | "collection";
export interface FeedForAdd {
  title: string;
  siteUrl: string;
  feedUrl: string;
  collectionId: string | null | undefined;
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

export type FeedActionType =
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

export const actionCreators = {
  addFeed,
  faildLoadFeed,
  resetFeeds,
  setIsChanged,
  deleteCollection,
  editTitleCollection,
  toggleVisibility,
};
