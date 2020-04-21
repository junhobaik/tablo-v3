import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faAngleLeft,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { actionCreators, WindowItem } from "../../modules/global/actions";
import { RootState } from "../../modules";
import "./index.scss";

type Content = "tabs" | "feeds";

interface ContentHeaderProps {
  content: Content;
  searchFunc: Function;
  reverse: boolean;
}

const ContentHeader = (props: ContentHeaderProps) => {
  const { content, reverse } = props;
  const dispatch = useDispatch();
  const windowStatus = useSelector((state: RootState) => state.global.window);
  const contentUpperCaseName =
    content.charAt(0).toUpperCase() + content.slice(1);
  console.log(props);

  const openSetting = () => {
    if (windowStatus === "default") {
      const windowName = `${content}-setting` as WindowItem;
      dispatch(actionCreators.setWindow(windowName));
    } else {
      dispatch(actionCreators.setWindow("default"));
    }
  };

  return (
    <div
      className={`${content}-header content-header ${reverse ? "reverse" : ""}`}
    >
      <div className="content-search">
        <Fa icon={faSearch} />
        <input type="text" name="" id={`${content}-search-input`} />
      </div>
      <button onClick={openSetting}>
        {windowStatus === "default" ? (
          <>
            <span>{`Open ${contentUpperCaseName} Menu`}</span>
            <Fa icon={faAngleRight} />
          </>
        ) : (
          <>
            <span>{`Close ${contentUpperCaseName} Menu`}</span>
            <Fa icon={faAngleLeft} />
          </>
        )}
      </button>
    </div>
  );
};

export default ContentHeader;
