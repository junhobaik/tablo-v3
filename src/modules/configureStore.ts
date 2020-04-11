import { createStore } from "redux";
import rootReducer from "./index";

export default function configureStore() {
  const devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
  const store = createStore(rootReducer, devTools && devTools());
  return store;
}
