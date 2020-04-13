import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
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
          {windowStatus === "default"
            ? "Open Tabs Setting"
            : "Close Tabs Setting"}
        </button>
      </div>
    </div>
  );
};

export default Tabs;
