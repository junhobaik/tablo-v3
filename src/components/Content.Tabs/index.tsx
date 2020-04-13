import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faAngleLeft,
} from "@fortawesome/free-solid-svg-icons";
import { actionCreators } from "../../modules/global/actions";
import { RootState } from "../../modules";
import "./index.scss";

const Tabs = () => {
  const dispatch = useDispatch();
  const windowStatus = useSelector((state: RootState) => state.global.window);

  const openTabsSetting = () => {
    if (windowStatus === "default") {
      dispatch(actionCreators.setWindow("tabs-setting"));
    } else {
      dispatch(actionCreators.setWindow("default"));
    }
  };

  return (
    <div id="Tabs">
      <div className="tabs-header content-header">
        <button onClick={openTabsSetting}>
          {windowStatus === "default" ? (
            <>
              <span>Open Tabs Menu</span>
              <Fa icon={faAngleRight} />
            </>
          ) : (
            <>
              <span>Close Tabs Menu</span>
              <Fa icon={faAngleLeft} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Tabs;
