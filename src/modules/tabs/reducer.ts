import {
  TabItem,
  TabActionTypes,
  CollectionItem,
  ADD_TAB_ITEM,
  RESET_TABS,
} from "./actions";
import { v4 as uuidv4 } from "uuid";

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
    case RESET_TABS:
      return action.state ?? initialState;
    default:
      return state;
  }
}

export default tabReducer;
