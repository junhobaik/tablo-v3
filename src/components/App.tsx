import * as React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { hot } from "react-hot-loader";

import { RootState } from "../modules";
import Tabs from "./Content.Tabs";
import Feeds from "./Content.Feeds";
import Header from "./Header";
import TabsSetting from "./Content.TabsSetting";
import FeedsSetting from "./Content.FeedsSetting";

import "./app.scss";
import "./content.scss";

const App = () => {
  const windowStatus = useSelector((state: RootState) => state.global.window);

  useEffect(() => {
    console.log(windowStatus);
  }, [windowStatus]);

  return (
    <div id="App">
      <Header />

      <div className="app-bottom">
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
