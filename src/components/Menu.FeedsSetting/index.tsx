import * as React from "react";
import { useSelector } from "react-redux";

import "./index.scss";
import { RootState } from "../../modules";
import AddFeed from "./AddFeed";
import FeedCollection from "./FeedCollection";

const FeedsSetting = () => {
  const feedsState = useSelector((state: RootState) => state.feeds);
  const globalState = useSelector((state: RootState) => state.global);

  return (
    <div className="feeds-setting">
      <AddFeed feedsState={feedsState} />
      <FeedCollection feedsState={feedsState} globalState={globalState} />
    </div>
  );
};

export default FeedsSetting;
