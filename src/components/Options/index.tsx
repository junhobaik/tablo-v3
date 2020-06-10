import * as React from "react";
import { hot } from "react-hot-loader";
import "./index.scss";
import Setting from "../Global.Setting";

const Options = () => {
  return (
    <div id="Options">
      <h1>Options</h1>
      <Setting />
    </div>
  );
};

export default hot(module)(Options);
