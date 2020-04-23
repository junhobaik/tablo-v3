import * as React from "react";
import * as ReactDOM from "react-dom";

import { Provider } from "react-redux";
import configureStore from "../modules/configureStore";

import App from "../components/App";

const store = configureStore();

store.subscribe(() => {
  const state = store.getState();

  console.log("state: ", state);
  if (chrome) {
    chrome.storage.sync.set({
      tablo3: state,
    });
  }
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
