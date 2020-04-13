import * as React from "react";
import { ThemeProvider } from "theme-ui";
import { hot } from "react-hot-loader";
import "./app.scss";
import Tabs from "./Tabs";
import Feeds from "./Feeds";
import Header from "./Header";
import theme from "../styles/theme";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
};

export default hot(module)(App);
