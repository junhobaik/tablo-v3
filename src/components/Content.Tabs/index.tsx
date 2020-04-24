import * as React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faCog,
  faPen,
  faTimes,
  faAngleUp,
} from "@fortawesome/free-solid-svg-icons";
import { faWindowRestore, faFile } from "@fortawesome/free-regular-svg-icons";
import _ from "lodash";

import { RootState } from "../../modules";
import {
  CollectionItem,
  TabItem,
  actionCreators,
} from "../../modules/tabs/actions";
import ContentHeader from "../Content.Header";
import "./index.scss";

interface TargetData {
  id: string;
}

const Tabs = () => {
  const dispatch = useDispatch();

  const [targetData, setTargetData] = useState<TargetData | {}>();
  targetData;
  const tabsState = useSelector((state: RootState) => state.tabs);
  const { collections, tabs } = tabsState;

  const collectionListData = collections;
  const tabListData = tabs;

  const toggleFoldedCollection = (id: string) => {
    dispatch(actionCreators.setFoldedCollection(id));
  };

  const createTabList = (tabList: TabItem[]) => {
    return tabList.map((v: TabItem) => {
      return (
        <li
          className="tab-item"
          key={`tab-${v.id}`}
          onMouseEnter={(e: React.MouseEvent) => {
            const menu = e.currentTarget.querySelector(".tab-menu");
            menu?.classList.remove("hide");
            menu?.classList.add("show");

            setTargetData({
              id: v.id,
            });
          }}
          onMouseLeave={(e: React.MouseEvent) => {
            const menu = e.currentTarget.querySelector(".tab-menu");
            menu?.classList.remove("show");
            menu?.classList.add("hide");
            setTargetData({});
          }}
        >
          <a className="tab-link" href={v.url}>
            <div className="tab-header">
              <div className="tab-icon">
                <div className="no-favicon">
                  <Fa icon={faFile} />
                </div>

                <div className="favicon">
                  <img
                    src={`${v.url
                      .split("/")
                      .splice(0, 3)
                      .join("/")}/favicon.ico`}
                    onError={(e: any) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentNode.parentNode.firstChild.style.display =
                        "inline-block";
                    }}
                  />
                </div>
              </div>
              <div className="tab-title">{v.title}</div>
            </div>
            <div className="tab-description">
              <p>{v.description}</p>
            </div>
          </a>
          <div className="tab-menu hide">
            <button className="edit-btn">
              <Fa icon={faPen} />
            </button>

            <button className="delete-btn">
              <Fa icon={faTimes} />
            </button>
          </div>
        </li>
      );
    });
  };

  const collectionList = collectionListData.map((v: CollectionItem) => {
    const filteredTabs = _.filter(tabListData, { collection: v.id });
    const tabList = createTabList(filteredTabs);

    return (
      <li className="collection" key={`collection-${v.id}`}>
        <div className="collection-header">
          <div className="collection-title">
            <div className="collection-fold">
              <button
                className="fold-btn"
                onClick={() => {
                  toggleFoldedCollection(v.id);
                }}
              >
                <Fa icon={v.folded ? faAngleDown : faAngleUp} />
              </button>
            </div>
            <h2 className="title-text">{v.title}</h2>
          </div>
          <div className="collection-menu">
            <div className="collection-open-all">
              <button className="open-all-btn circle-btn">
                <Fa icon={faWindowRestore} />
              </button>
            </div>
            <div className="collection-setting">
              <button className="setting-btn circle-btn">
                <Fa icon={faCog} />
              </button>
            </div>
          </div>
        </div>

        <ol
          className="collection-tab-list"
          style={{ display: v.folded ? "none" : "flex" }}
        >
          {tabList}
        </ol>
      </li>
    );
  });
  return (
    <div id="Tabs">
      <ContentHeader content="tabs" searchFunc={() => {}} reverse={false} />
      <div className="tabs-content">
        <ol className="collection-list">{collectionList}</ol>
        <div className="tabs-add-collection">
          <button>+</button>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
