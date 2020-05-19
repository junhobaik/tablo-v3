import {
  FeedActionType,
  ADD_FEED,
  FAILD_LOAD_FEED,
  RESET_FEED,
  FeedsState,
  SET_ISCHANGED,
  ADD_COLLECTION,
  DELETE_COLLECTION,
  EDIT_COLLECTION_TITLE,
  TOGGLE_VISIBILITY,
} from "./actions";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

const initialState: FeedsState = {
  loaded: false,
  isChanged: false,
  feeds: [
    // {
    //   id: "ff1",
    //   title: "Dev.White",
    //   siteUrl: "https://junhobaik.github.io",
    //   feedUrl: "https://junhobaik.github.io/rss",
    //   collectionId: "fc1",
    //   faildCount: 0,
    //   visibility: true,
    // },
    {
      id: "ff2",
      title: "Kakao Tech",
      siteUrl: "https://tech.kakao.com",
      feedUrl: "https://tech.kakao.com/feed",
      collectionId: "fc2",
      faildCount: 0,
      visibility: true,
    },
  ],
  collections: [
    {
      id: "fc1",
      title: "collection 1",
      visibility: true,
    },

    {
      id: "fc2",
      title: "collection 2",
      visibility: true,
    },

    {
      id: "fc3",
      title: "collection 3",
      visibility: false,
    },

    {
      id: "fc4",
      title: "collection 4",
      visibility: true,
    },
  ],
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

    case ADD_COLLECTION: {
      return {
        ...state,
        collections: [
          ...state.collections,
          {
            id: uuidv4(),
            title: `Collection [${moment().format("YYMMDD HH:mm:ss")}]`,
            visibility: true,
          },
        ],
      };
    }

    case ADD_FEED: {
      const { title, siteUrl, feedUrl, collectionId } = action.payload;
      const findedFeed = _.find(state.feeds, ["feedUrl", feedUrl]);
      if (findedFeed) return state;

      if (collectionId) {
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
              visibility: true,
              collectionId,
            },
          ],
          isChanged: true,
        };
      }

      const newCollectionId = uuidv4();
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
            visibility: true,
            collectionId: newCollectionId,
          },
        ],
        collections: [
          ...state.collections,
          {
            id: newCollectionId,
            title: `Collection [${moment().format("YYMMDD HH:mm:ss")}]`,
            visibility: true,
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

    case DELETE_COLLECTION: {
      const newState = _.cloneDeep(state);
      const collectionID = action.id;
      _.remove(newState.feeds, (item) => {
        if (item.collectionId === collectionID) return true;
        return false;
      });
      _.remove(newState.collections, (collection) => {
        if (collection.id === collectionID) return true;
        return false;
      });
      return newState;
    }

    case EDIT_COLLECTION_TITLE: {
      const newState = _.cloneDeep(state);
      const index = _.findIndex(newState.collections, ["id", action.id]);
      newState.collections[index].title = action.title;
      return newState;
    }

    case TOGGLE_VISIBILITY: {
      const newState = _.cloneDeep(state);

      if (action.targetType === "feed") {
        const index = _.findIndex(newState.feeds, ["id", action.id]);
        const old = newState.feeds[index].visibility;
        newState.feeds[index].visibility = !old;
      } else {
        const index = _.findIndex(newState.collections, ["id", action.id]);
        const old = newState.collections[index].visibility;
        newState.collections[index].visibility = !old;
      }

      return newState;
    }

    default:
      return state;
  }
};

export default feedsReducer;
