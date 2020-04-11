export const ADD_TAB_ITEM = "tab/ADD_TAB_ITEM";

export interface TabItem {
  title: string;
}

interface AddTabItemAction {
  type: typeof ADD_TAB_ITEM;
  payload: TabItem;
}

export type TabActionTypes = AddTabItemAction;

const addTabItem = (title: string) => {
  return { type: ADD_TAB_ITEM, payload: { title } };
};

export const actionCreators = {
  addTabItem,
};

// reducers

// export interface TabState {
//   tabs: TabItem[];
// }

// const initialState: TabState = {
//   tabs: [],
// };

// export function todoReducer(
//   state = initialState,
//   action: TabActionTypes
// ): TabState {
//   switch (action.type) {
//     case ADD_TAB_ITEM:
//       return {
//         ...state,
//         tabs: [...state.tabs, { title: action.payload.title }],
//       };
//     default:
//       return state;
//   }
// }
