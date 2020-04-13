import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";

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
          {windowStatus === "default" ? (
            <>
              {" "}
              <Fa icon={faAngleLeft} />
              <span>Open Feeds Menu</span>
            </>
          ) : (
            <>
              <Fa icon={faAngleRight} />
              <span>Close Feeds Menu</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Feeds;
