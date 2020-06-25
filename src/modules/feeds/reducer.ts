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
  TOGGLE_ADD_FEED,
} from './actions';
import _ from 'lodash';
import { generate as uuid } from 'short-uuid';
import moment from 'moment';

const initialState: FeedsState = {
  loaded: false,
  isChanged: false,
  feeds: [
    {
      id: 'FI1',
      title: 'Dev.White',
      siteUrl: 'https://junhobaik.github.io',
      feedUrl: 'https://junhobaik.github.io/rss',
      collectionID: 'FC1',
      faildCount: 0,
      visibility: true,
    },
  ],
  collections: [
    {
      id: 'FC1',
      title: 'Collection',
      visibility: true,
    },
  ],
  readPosts: [],
  foldAddFeed: false,
};

const feedsReducer = (state = initialState, action: FeedActionType): FeedsState => {
  switch (action.type) {
    case RESET_FEED: {
      sessionStorage.setItem('tablo3_feeds', 'true');
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
            id: uuid(),
            title: `New Collection [${moment().format('YYMMDD HH:mm:ss')}]`,
            visibility: true,
          },
        ],
      };
    }

    case ADD_FEED: {
      const { title, siteUrl, feedUrl, collectionID } = action.payload;
      const findedFeed = _.find(state.feeds, ['feedUrl', feedUrl]);
      if (findedFeed) return state;

      if (collectionID) {
        return {
          ...state,
          feeds: [
            ...state.feeds,
            {
              id: uuid(),
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

      const newCollectionId = uuid();
      return {
        ...state,
        feeds: [
          ...state.feeds,
          {
            id: uuid(),
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
            title: `New Collection [${moment().format('YYMMDD HH:mm:ss')}]`,
            visibility: true,
          },
        ],
        isChanged: true,
      };
    }

    case EDIT_FEED_TITEL: {
      const newState = _.cloneDeep(state);
      const index = _.findIndex(newState.feeds, ['id', action.id]);
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
      const findedIndex = _.findIndex(newState.feeds, ['id', action.id]);

      if (action.count !== undefined) {
        newState.feeds[findedIndex].faildCount = action.count;
      } else {
        newState.feeds[findedIndex].faildCount += 1;
      }

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
      const index = _.findIndex(newState.collections, ['id', action.id]);
      newState.collections[index].title = action.title;
      return newState;
    }

    case TOGGLE_VISIBILITY: {
      const newState = _.cloneDeep(state);

      if (action.targetType === 'feed') {
        const index = _.findIndex(newState.feeds, ['id', action.id]);
        const old = newState.feeds[index].visibility;
        newState.feeds[index].visibility = !old;
      } else {
        const index = _.findIndex(newState.collections, ['id', action.id]);
        const old = newState.collections[index].visibility;
        newState.collections[index].visibility = !old;
      }

      return newState;
    }

    case MOVE_FEED_ITEM: {
      const newState = _.cloneDeep(state);
      const { dropCollectionID, dragItemID, dropIndex } = action;
      const { feeds } = newState;
      let targetIndex = dropIndex;
      const item = _.find(feeds, ['id', dragItemID]);
      if (item) {
        const filteredFeed = _.filter(feeds, ['collectionID', dropCollectionID]);
        if (item.collectionID === dropCollectionID) {
          if (_.findIndex(filteredFeed, ['id', dragItemID]) < dropIndex) targetIndex -= 1;
          _.remove(filteredFeed, ['id', dragItemID]);
        } else {
          item.collectionID = dropCollectionID;
        }
        _.remove(feeds, ['id', dragItemID]);
        _.remove(feeds, ['collectionID', dropCollectionID]);
        newState.feeds = [
          ...feeds,
          ..._.slice(filteredFeed, 0, targetIndex),
          item,
          ..._.slice(filteredFeed, targetIndex),
        ];
      }
      return newState;
    }

    case MOVE_FEED_COLLECTION: {
      const newState = _.cloneDeep(state);
      const { dragCollectionID, dropIndex } = action;

      const findedIndex = _.findIndex(newState.collections, ['id', dragCollectionID]);
      const findedCollection = _.cloneDeep(newState.collections[findedIndex]);

      _.remove(newState.collections, ['id', dragCollectionID]);

      const targetIndex = dropIndex > findedIndex ? dropIndex - 1 : dropIndex;

      newState.collections = [
        ..._.slice(newState.collections, 0, targetIndex),
        findedCollection,
        ..._.slice(newState.collections, targetIndex, newState.collections.length),
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

    case TOGGLE_ADD_FEED: {
      return { ...state, foldAddFeed: action.isFold };
    }

    default:
      return state;
  }
};

export default feedsReducer;
