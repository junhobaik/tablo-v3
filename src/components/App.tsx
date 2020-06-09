import * as React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hot } from "react-hot-loader";

import { RootState } from "../modules";
import Tabs from "./Content.Tabs";
import Feeds from "./Content.Feeds";
import Header from "./Global.Header";
import TabsSetting from "./Menu.TabsSetting";
import FeedsSetting from "./Menu.FeedsSetting";
import { actionCreators as tabsActionCreators } from "../modules/tabs/actions";
import { actionCreators as globalActionCreators } from "../modules/global/actions";
import { actionCreators as feedsActionCreators } from "../modules/feeds/actions";

import "./app.scss";
import "../styles/content.scss";
import utils from "./utils";

const App = () => {
  const dispatch = useDispatch();
  const [isLoadedState, setIsLoadedState] = useState(false);
  const windowStatus = useSelector((state: RootState) => state.global.window);
  const state = useSelector((state: RootState) => state); // dev

  const loadAndSetStates = (reloadPosts: boolean = false) => {
    chrome.storage.sync.get("tablo3", (res) => {
      if (res.tablo3) {
        const { tabs, global, feeds } = res.tablo3;
        dispatch(globalActionCreators.resetGlobal(global));
        dispatch(tabsActionCreators.resetTabs(tabs));
        dispatch(feedsActionCreators.resetFeeds(feeds));
        if (reloadPosts) dispatch(feedsActionCreators.setIsChanged(true));
      } else {
        dispatch(feedsActionCreators.setIsChanged(true));
      }
      setIsLoadedState(true);
    });
  };

  useEffect(() => {
    const { getLoaclStorage, setLocalStorage } = utils;

    const detectChange = setInterval(() => {
      const isChanged = JSON.parse(
        getLoaclStorage("tablo3_changed") ?? "false"
      );
      const isNeedReloadPosts = JSON.parse(
        getLoaclStorage("tablo3_reload-posts") ?? "false"
      );

      if (isChanged) {
        setLocalStorage("tablo3_changed", "false");
        loadAndSetStates(isNeedReloadPosts);
        if (isNeedReloadPosts) setLocalStorage("tablo3_reload-posts", false);
      } else {
        console.log(isChanged);
      }
    }, 5000);

    loadAndSetStates();

    return () => {
      clearInterval(detectChange);
    };
  }, []);

  // dev
  useEffect(() => {
    const func = (e: KeyboardEvent) => {
      switch (e.keyCode) {
        case 192: // `
          console.log("- state");
          console.log("  - global: ", state.global);
          console.log("  - tabs  : ", state.tabs);
          console.log("  - feeds : ", state.feeds);
          break;

        default:
          break;
      }
    };
    document.addEventListener("keydown", func);

    return () => {
      document.removeEventListener("keydown", func);
    };
  }, [state]);

  return (
    <div id="App">
      <Header />

      <div
        className="app-bottom"
        style={{ visibility: isLoadedState ? "visible" : "hidden" }}
      >
        <div className="app-bottom-left">
          {windowStatus === "feeds-setting" ? <FeedsSetting /> : <Tabs />}
        </div>
        <div className="app-bottom-right">
          {windowStatus === "tabs-setting" ? <TabsSetting /> : <Feeds />}
        </div>
      </div>
    </div>
  );
};

export default hot(module)(App);
