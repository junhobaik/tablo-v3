import {
  TabsActionTypes,
  TabsState,
  ADD_COLLECTION,
  ADD_TAB_ITEM,
  RESET_TABS,
  SET_FOLDED_COLLECTION,
  DELETE_TAB_ITEM,
  EDIT_TAB_ITEM_TITLE,
  EDIT_TAB_ITEM_DESCRIPTION,
  TABS_ARCHIVE,
  DELETE_COLLECTION,
  EDIT_COLLECTION_TITLE,
  MOVE_COLLECTION,
  MOVE_TAB_ITEM,
  EMPTY_CART,
  DELETE_CART_ITEM,
} from './actions';
import { generate as uuid } from 'short-uuid';
import _ from 'lodash';
import moment from 'moment';

const initialState: TabsState = {
  collections: [
    {
      id: 'TC0',
      title: 'Tab Collection',
      folded: false,
    },
  ],
  tabs: [
    {
      id: 'TI1',
      title: 'Google',
      description: '',
      url: 'https://www.google.com/',
      collection: 'TC0',
    },
    {
      id: 'TI2',
      title: 'junhobaik/tablo-v3',
      description: 'Github repository',
      url: 'https://github.com/junhobaik/tablo-v3',
      collection: 'TC0',
    },
  ],
  cart: [
    {
      title: 'Dev.White Blog',
      url: 'https://junhobaik.github.io/',
    },
  ],
};

function tabReducer(state = initialState, action: TabsActionTypes): TabsState {
  switch (action.type) {
    case ADD_COLLECTION: {
      return {
        ...state,
        collections: [
          ...state.collections,
          {
            id: uuid(),
            title: `New Collection [${moment().format('YYMMDD HH:mm:ss')}]`,
            folded: false,
          },
        ],
      };
    }
    case ADD_TAB_ITEM: {
      const { index } = action.state;
      const newItem = {
        id: uuid(),
        title: action.state.title,
        description: action.state.description,
        url: action.state.url,
        collection: action.state.collection,
      };

      if (index !== null) {
        return {
          ...state,
          tabs: [..._.slice(state.tabs, 0, index), newItem, ..._.slice(state.tabs, index, state.tabs.length)],
        };
      }

      return {
        ...state,
        tabs: [...state.tabs, newItem],
      };
    }

    case DELETE_TAB_ITEM: {
      const newState = _.cloneDeep(state);
      _.remove(newState.tabs, { id: action.id });
      return newState;
    }

    case RESET_TABS:
      return action.state ?? initialState;

    case SET_FOLDED_COLLECTION: {
      const newState = _.cloneDeep(state);
      const targetIndex = _.findIndex(newState.collections, { id: action.id });
      const folded = newState.collections[targetIndex].folded ?? false;
      newState.collections[targetIndex].folded = !folded;
      return newState;
    }

    case EDIT_TAB_ITEM_TITLE: {
      const newState = _.cloneDeep(state);
      const targetIndex = _.findIndex(newState.tabs, { id: action.id });
      newState.tabs[targetIndex].title = action.title;
      return newState;
    }

    case EDIT_TAB_ITEM_DESCRIPTION: {
      const newState = _.cloneDeep(state);
      const targetIndex = _.findIndex(newState.tabs, { id: action.id });
      newState.tabs[targetIndex].description = action.description;
      return newState;
    }

    case TABS_ARCHIVE: {
      const collectionID = uuid();
      const newItems = [];

      for (const v of action.items) {
        newItems.push({
          id: uuid(),
          title: v.title,
          description: '',
          url: v.url,
          collection: collectionID,
        });
      }

      return {
        ...state,
        collections: [
          ...state.collections,
          {
            id: collectionID,
            title: `Archive [${moment().format('YYMMDD HH:mm:ss')}]`,
            folded: false,
          },
        ],
        tabs: [...state.tabs, ...newItems],
      };
    }

    case DELETE_COLLECTION: {
      const newState = _.cloneDeep(state);
      const collectionID = action.collectionID;

      _.remove(newState.tabs, (item) => {
        if (item.collection === collectionID) return true;
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

    case MOVE_COLLECTION: {
      const newState = _.cloneDeep(state);
      const index = _.findIndex(newState.collections, ['id', action.id]);
      const temp = _.cloneDeep(newState.collections[index]);
      _.remove(newState.collections, ['id', action.id]);
      const targetIndex = action.index > index ? action.index - 1 : action.index;
      newState.collections = [
        ..._.slice(newState.collections, 0, targetIndex),
        temp,
        ..._.slice(newState.collections, targetIndex, newState.collections.length),
      ];
      return newState;
    }

    case MOVE_TAB_ITEM: {
      const newState = _.cloneDeep(state);
      const { dropCollectionID, dragItemID, dropIndex } = action;
      const { tabs } = newState;
      let targetIndex = dropIndex;
      const item = _.find(tabs, ['id', dragItemID]);
      if (item) {
        const filteredTab = _.filter(tabs, ['collection', dropCollectionID]);
        if (item.collection === dropCollectionID) {
          if (_.findIndex(filteredTab, ['id', dragItemID]) < dropIndex) targetIndex -= 1;
          _.remove(filteredTab, ['id', dragItemID]);
        } else {
          item.collection = dropCollectionID;
        }
        _.remove(tabs, ['id', dragItemID]);
        _.remove(tabs, ['collection', dropCollectionID]);
        newState.tabs = [...tabs, ..._.slice(filteredTab, 0, targetIndex), item, ..._.slice(filteredTab, targetIndex)];
      }
      return newState;
    }

    case EMPTY_CART: {
      return { ...state, cart: [] };
    }

    case DELETE_CART_ITEM: {
      const newState = _.cloneDeep(state);
      _.remove(newState.cart, ['url', action.url]);
      return newState;
    }

    default:
      return state;
  }
}

export default tabReducer;
