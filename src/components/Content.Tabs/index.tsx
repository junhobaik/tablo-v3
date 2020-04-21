import * as React from "react";
import "./index.scss";
import ContentHeader from "../Content.Header";

const Tabs = () => {
  return (
    <div id="Tabs">
      <ContentHeader content="tabs" searchFunc={() => {}} reverse={false} />
      <div className="tabs-content"></div>
    </div>
  );
};

export default Tabs;
