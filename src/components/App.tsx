import * as React from "react";
import { hot } from "react-hot-loader";
import "./app.scss";
import Tabs from "./Tabs";
import Feeds from "./Feeds";
import Header from "./Header";

const App = () => {
  return (
    <div id="App">
      <Header />

      <div className="app-bottom">
        <div className="app-bottom-left">
          <Tabs />
        </div>
        <div className="app-bottom-right">
          <Feeds />
        </div>
      </div>
    </div>
  );
};

export default hot(module)(App);
