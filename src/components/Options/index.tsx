import React from "react";
import icon from "../../img/icon-128.png";
import { hot } from "react-hot-loader";
import "./index.scss";

class Options extends React.Component {
  render() {
    return (
      <div id="options">
        <h1>options</h1>
        <img src={icon} />
      </div>
    );
  }
}

export default hot(module)(Options);
