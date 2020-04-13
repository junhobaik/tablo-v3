import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../../modules/global/actions";
import { RootState } from "../../modules";
import "./index.scss";

const Feeds = () => {
  const dispatch = useDispatch();
  const windowStatus = useSelector((state: RootState) => state.global.window);

  const openFeedsSetting = () => {
    if (windowStatus === "default") {
      dispatch(actionCreators.setWindow("feeds-setting"));
    } else {
      dispatch(actionCreators.setWindow("default"));
    }
  };

  return (
    <div id="Feeds">
      <div className="feeds-header content-header">
        <button onClick={openFeedsSetting}>
          {windowStatus === "default"
            ? "Open Feeds Setting"
            : "Close Feeds Setting"}
        </button>
      </div>
    </div>
  );
};

export default Feeds;
