import * as React from "react";
import "./index.scss";
import ContentHeader from "../Content.Header";

const Feeds = () => {
  return (
    <div id="Feeds">
      <ContentHeader content="feeds" searchFunc={() => {}} reverse={true} />
      <div className="feeds-content"></div>
    </div>
  );
};

export default Feeds;
