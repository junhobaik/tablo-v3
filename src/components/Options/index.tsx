import * as React from "react";
import { hot } from "react-hot-loader";
import "./index.scss";
import Setting from "../Global.Setting";

const Options = () => {
  return (
    <div id="options">
      <Setting />
    </div>
  );
};

export default hot(module)(Options);
