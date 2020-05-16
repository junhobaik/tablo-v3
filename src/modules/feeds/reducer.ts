import {
  FeedActionType,
  ADD_FEED,
  FAILD_LOAD_FEED,
  RESET_FEED,
  FeedsState,
  SET_ISCHANGED,
} from "./actions";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

const initialState: FeedsState = {
  loaded: false,
  isChanged: false,
  feeds: [],
};

const feedsReducer = (
  state = initialState,
  action: FeedActionType
): FeedsState => {
  switch (action.type) {
    case RESET_FEED: {
      sessionStorage.setItem("tablo3_feeds", "true");
      return { ...action.state, loaded: true };
    }

    case SET_ISCHANGED: {
      return { ...state, isChanged: action.isChanged };
    }

    case ADD_FEED: {
      const { title, siteUrl, feedUrl } = action.payload;
      const findedFeed = _.find(state.feeds, ["feedUrl", feedUrl]);
      if (findedFeed) return state;

      return {
        ...state,
        feeds: [
          ...state.feeds,
          {
            id: uuidv4(),
            title,
            siteUrl,
            feedUrl,
            faildCount: 0,
          },
        ],
        isChanged: true,
      };
    }

    case FAILD_LOAD_FEED: {
      const newState = _.cloneDeep(state);
      const findedIndex = _.findIndex(newState.feeds, ["id", action.id]);
      newState.feeds[findedIndex].faildCount += 1;

      return newState;
    }

    default:
      return state;
  }
};

export default feedsReducer;
