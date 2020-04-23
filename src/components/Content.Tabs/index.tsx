import * as React from "react";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faCog,
  faPen,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { faWindowRestore, faFile } from "@fortawesome/free-regular-svg-icons";
import "./index.scss";
import ContentHeader from "../Content.Header";

const Tabs = () => {
  const collectionListData: any = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

  const createTabList = (tabList: any) => {
    return tabList.map(() => {
      return (
        <li className="tab-item">
          <div className="tab-header">
            <div className="tab-icon">
              <Fa icon={faFile} />
            </div>
            <div className="tab-title">Tab Title</div>

            <div className="tab-menu">
              <button className="edit-btn">
                <Fa icon={faPen} />
              </button>

              <button className="delete-btn">
                <Fa icon={faTimes} />
              </button>
            </div>
          </div>
          <div className="tab-description">
            <p>Tab Description</p>
          </div>
        </li>
      );
    });
  };

  const collectionList = collectionListData.map((v: any, i: number) => {
    v;
    const tabList = createTabList([1, 1, 1, 1, 1, 1, 1, 1]);
    console.log(tabList);
    return (
      <li className="collection" key={`collection-${i}`}>
        <div className="collection-header">
          <div className="collection-title">
            <div className="collection-flip">
              <button className="flip-btn">
                <Fa icon={faAngleDown} />
              </button>
            </div>
            <h2 className="title-text">Collection 1</h2>
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
