import React from "react";
import icon from "../../img/icon-128.png";
import { hot } from "react-hot-loader";
import "./index.scss";

class Popup extends React.Component {
  render() {
    return (
      <div id="popup">
        <h1>popup</h1>
        <img src={icon} />
      </div>
    );
  }
}

export default hot(module)(Popup);
