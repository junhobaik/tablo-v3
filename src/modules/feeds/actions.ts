export const ADD_FEED = "feeds/ADD_FEED";
export const FAILD_LOAD_FEED = "feeds/FAILD_LOAD_FEED";
export const RESET_FEED = "feeds/RESET_FEED";
export const SET_ISCHANGED = "feeds/SET_ISCHANGED";

export interface FeedForAdd {
  title: string;
  siteUrl: string;
  feedUrl: string;
}

export interface Feed extends FeedForAdd {
  id: string;
  faildCount: number;
}

export interface FeedItem {
  title: string;
  description: string;
  pubDate: string;
  siteUrl: string;
  postUrl: string;
}

export interface FeedsState {
  feeds: Feed[];
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

interface SET_ISCHANGED {
  type: typeof SET_ISCHANGED;
  isChanged: boolean;
}

export type FeedActionType =
  | SET_ISCHANGED
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

export const actionCreators = {
  addFeed,
  faildLoadFeed,
  resetFeeds,
  setIsChanged,
};
