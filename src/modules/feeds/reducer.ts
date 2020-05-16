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
  isChanged: false,
  feeds: [
    {
      id: "f1",
      title: "Dev.White",
      siteUrl: "https://junhobaik.github.io",
      feedUrl: "https://junhobaik.github.io/rss",
      faildCount: 0,
    },
    {
      id: "f2",
      title: "Kakao Tech",
      siteUrl: "https://tech.kakao.com",
      feedUrl: "https://tech.kakao.com/feed",
      faildCount: 0,
    },
    {
      id: "f5",
      title: "Dev.White (Error)",
      siteUrl: "https://junhobaik.github.io",
      feedUrl: "https://junhobaik.github.io/rs",
      faildCount: 0,
    },
    {
      id: "f3",
      title: "Naver D2",
      siteUrl: "https://d2.naver.com",
      feedUrl: "https://d2.naver.com/d2.atom",
      faildCount: 0,
    },
  ],
};

const feedsReducer = (
  state = initialState,
  action: FeedActionType
): FeedsState => {
  switch (action.type) {
    case RESET_FEED: {
      return action.state ?? state;
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
