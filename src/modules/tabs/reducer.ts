import { TabItem, TabActionTypes, ADD_TAB_ITEM } from "./actions";

export interface TabState {
  tabs: TabItem[];
}

const initialState: TabState = {
  tabs: [],
};

function tabReducer(state = initialState, action: TabActionTypes): TabState {
  switch (action.type) {
    case ADD_TAB_ITEM:
      return {
        ...state,
        tabs: [...state.tabs, { title: action.payload.title }],
      };
    default:
      return state;
  }
}

export default tabReducer;
