import {
  TabItem,
  TabActionTypes,
  CollectionItem,
  ADD_TAB_ITEM,
  RESET_TABS,
  SET_FOLDED_COLLECTION,
  DELETE_TAB_ITEM,
  EDIT_TAB_ITEM_TITLE,
  EDIT_TAB_ITEM_DESCRIPTION,
} from "./actions";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

export interface TabsState {
  tabs: TabItem[];
  collections: CollectionItem[];
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
};

function tabReducer(state = initialState, action: TabActionTypes): TabsState {
  switch (action.type) {
    case ADD_TAB_ITEM:
      return {
        ...state,
        tabs: [
          ...state.tabs,
          {
            id: uuidv4(),
            title: action.payload.title,
            description: action.payload.description,
            url: action.payload.url,
            collection: action.payload.collection,
          },
        ],
      };

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

    default:
      return state;
  }
}

export default tabReducer;
