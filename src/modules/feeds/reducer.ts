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
  EDIT_FEED_TITEL,
  DELETE_FEED,
  MOVE_FEED_COLLECTION,
  MOVE_FEED_ITEM,
  READ_POST,
} from "./actions";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

const initialState: FeedsState = {
  loaded: false,
  isChanged: false,
  feeds: [
    {
      id: "ff0",
      title: "Dev.White (err)",
      siteUrl: "https://junhobaik.github.io",
      feedUrl: "https://junhobaik.github.io/rsss",
      collectionID: "fc1",
      faildCount: 0,
      visibility: true,
    },
    {
      id: "ff1",
      title: "Dev.White",
      siteUrl: "https://junhobaik.github.io",
      feedUrl: "https://junhobaik.github.io/rss",
      collectionID: "fc1",
      faildCount: 0,
      visibility: true,
    },
    {
      id: "ff2",
      title: "Kakao Tech",
      siteUrl: "https://tech.kakao.com",
      feedUrl: "https://tech.kakao.com/feed",
      collectionID: "fc2",
      faildCount: 0,
      visibility: true,
    },
    {
      id: "ff3",
      title: "D2 Naver",
      siteUrl: "https://d2.naver.com",
      feedUrl: "https://d2.naver.com/d2.atom",
      collectionID: "fc2",
      faildCount: 0,
      visibility: true,
    },
    {
      id: "ff4",
      title: "Bloter",
      siteUrl: "http://www.bloter.net",
      feedUrl: "http://www.bloter.net/feed",
      collectionID: "fc2",
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
  readPosts: [],
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
      const { title, siteUrl, feedUrl, collectionID } = action.payload;
      const findedFeed = _.find(state.feeds, ["feedUrl", feedUrl]);
      if (findedFeed) return state;

      if (collectionID) {
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
              collectionID,
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
            collectionID: newCollectionId,
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

    case EDIT_FEED_TITEL: {
      const newState = _.cloneDeep(state);
      const index = _.findIndex(newState.feeds, ["id", action.id]);
      newState.feeds[index].title = action.title;
      return newState;
    }

    case DELETE_FEED: {
      const newState = _.cloneDeep(state);
      const feedId = action.id;
      _.remove(newState.feeds, (feed) => {
        if (feed.id === feedId) return true;
        return false;
      });
      return newState;
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
        if (item.collectionID === collectionID) return true;
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

    case MOVE_FEED_ITEM: {
      const newState = _.cloneDeep(state);
      const { dropCollectionID, dragFeedID, dropIndex } = action;
      const { feeds } = newState;

      const item = _.find(feeds, ["id", dragFeedID]);
      _.remove(feeds, ["id", dragFeedID]);

      const filteredFeeds = _.filter(feeds, ["collectionID", dropCollectionID]);
      _.remove(feeds, ["collectionID", dropCollectionID]);

      console.log(dropCollectionID, dragFeedID, dropIndex, item, filteredFeeds);

      if (item) {
        item.collectionID = dropCollectionID;
        newState.feeds = [
          ...feeds,
          ..._.slice(filteredFeeds, 0, dropIndex),
          item,
          ..._.slice(filteredFeeds, dropIndex, filteredFeeds.length),
        ];
      }
      return newState;
    }

    case MOVE_FEED_COLLECTION: {
      const newState = _.cloneDeep(state);
      const { dragCollectionID, dropIndex } = action;

      const findedIndex = _.findIndex(newState.collections, [
        "id",
        dragCollectionID,
      ]);
      const findedCollection = _.cloneDeep(newState.collections[findedIndex]);

      _.remove(newState.collections, ["id", dragCollectionID]);
      const targetIndex = dropIndex > findedIndex ? dropIndex - 1 : dropIndex;

      newState.collections = [
        ..._.slice(newState.collections, 0, targetIndex),
        findedCollection,
        ..._.slice(
          newState.collections,
          targetIndex,
          newState.collections.length
        ),
      ];
      return newState;
    }

    case READ_POST: {
      const newState = _.cloneDeep(state);
      const { isRead, postUrl } = action;
      const { readPosts } = newState;

      if (isRead && !_.find(readPosts, postUrl)) {
        readPosts.push(postUrl);
        if (readPosts.length >= 1000) readPosts.shift();
      } else {
        _.remove(readPosts, (url) => url === postUrl);
      }

      return newState;
    }

    default:
      return state;
  }
};

export default feedsReducer;
