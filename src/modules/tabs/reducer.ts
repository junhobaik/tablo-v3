import {
  TabItem,
  CollectionItem,
  SimpleItem,
  TabActionTypes,
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
} from "./actions";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import moment from "moment";

export interface TabsState {
  tabs: TabItem[];
  collections: CollectionItem[];
  cart: SimpleItem[];
}

const initialState: TabsState = {
  collections: [
    {
      id: "c1",
      title: "Collection 1",
      folded: false,
    },
    {
      id: "c2",
      title: "Development",
      folded: false,
    },
  ],
  tabs: [
    {
      id: "t1",
      title: "Google",
      description: "Google Search Page",
      url: "https://www.google.com/",
      collection: "c1",
    },
    {
      id: "t2",
      title: "My Blog",
      description: "Dev.White Blog",
      url: "https://junhobaik.github.io/",
      collection: "c2",
    },
  ],
  cart: [
    {
      title: "Dev.White",
      url: "https://junhobaik.github.io/",
    },
  ],
};

function tabReducer(state = initialState, action: TabActionTypes): TabsState {
  switch (action.type) {
    case ADD_COLLECTION: {
      return {
        ...state,
        collections: [
          ...state.collections,
          {
            id: uuidv4(),
            title: `Collection [${moment().format("YYMMDD HH:mm:ss")}]`,
            folded: false,
          },
        ],
      };
    }
    case ADD_TAB_ITEM: {
      const { index } = action.state;
      const newItem = {
        id: uuidv4(),
        title: action.state.title,
        description: action.state.description,
        url: action.state.url,
        collection: action.state.collection,
      };

      if (index !== null) {
        return {
          ...state,
          tabs: [
            ..._.slice(state.tabs, 0, index),
            newItem,
            ..._.slice(state.tabs, index, state.tabs.length),
          ],
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
      const collectionID = uuidv4();
      const newItems = [];

      for (const v of action.items) {
        newItems.push({
          id: uuidv4(),
          title: v.title,
          description: "",
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
            title: `Archive [${moment().format("YYMMDD HH:mm:ss")}]`,
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

      const index = _.findIndex(newState.collections, ["id", action.id]);
      newState.collections[index].title = action.title;

      return newState;
    }

    case MOVE_COLLECTION: {
      const newState = _.cloneDeep(state);
      const index = _.findIndex(newState.collections, ["id", action.id]);
      const temp = _.cloneDeep(newState.collections[index]);
      _.remove(newState.collections, ["id", action.id]);
      const targetIndex =
        action.index > index ? action.index - 1 : action.index;
      newState.collections = [
        ..._.slice(newState.collections, 0, targetIndex),
        temp,
        ..._.slice(
          newState.collections,
          targetIndex,
          newState.collections.length
        ),
      ];
      return newState;
    }

    default:
      return state;
  }
}

export default tabReducer;
