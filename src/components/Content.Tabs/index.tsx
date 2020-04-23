import * as React from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faCog,
  faPen,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { faWindowRestore, faFile } from "@fortawesome/free-regular-svg-icons";
import { CollectionItem, TabItem } from "../../modules/tabs/actions";
import { RootState } from "../../modules";
import _ from "lodash";

import "./index.scss";
import ContentHeader from "../Content.Header";

const Tabs = () => {
  const tabsState = useSelector((state: RootState) => state.tabs);
  const { collections, tabs } = tabsState;

  const collectionListData = collections;
  const tabListData = tabs;
  tabListData;

  const createTabList = (tabList: TabItem[]) => {
    return tabList.map((v: TabItem) => {
      return (
        <li className="tab-item" key={`tab-${v.id}`}>
          <a className="tab-link" href={v.url}>
            <div className="tab-header">
              <div className="tab-icon">
                <Fa icon={faFile} />
              </div>
              <div className="tab-title">{v.title}</div>
            </div>
            <div className="tab-description">
              <p>{v.description}</p>
            </div>
          </a>
          <div className="tab-menu">
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
            <div className="collection-flip">
              <button className="flip-btn">
                <Fa icon={faAngleDown} />
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

        <ol className="collection-tab-list">{tabList}</ol>
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
