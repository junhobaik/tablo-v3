import * as React from "react";
import { useState, useEffect } from "react";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-regular-svg-icons";

import "./index.scss";
import { faArchive } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";

interface CurrentTabItem {
  title: string | undefined;
  url: string | undefined;
  favIconUrl: string | undefined;
}

const Tabs = () => {
  const [currentTabList, setCurrentTabList] = useState<CurrentTabItem[]>([]);
  const getAllTabs = () => {
    chrome.windows.getAll({ populate: true }, (windows) => {
      const list = [];
      for (const window of windows) {
        if (window?.tabs) {
          for (const tab of window.tabs) {
            const { title, url, favIconUrl } = tab;
            if (url !== "chrome://newtab/")
              list.push({ title, url, favIconUrl });
          }
        }
      }
      setCurrentTabList(list);
    });
  };

  useEffect(() => {
    getAllTabs();
    chrome.tabs.onUpdated.addListener((_, changeInfo) => {
      if (changeInfo.status === "complete") getAllTabs();
    });

    chrome.tabs.onRemoved.addListener(() => {
      getAllTabs();
    });
  }, []);

  const mapCurrentTabList = currentTabList.map(
    (v: CurrentTabItem, i: number) => {
      return (
        <li className="link-item" key={`link-${v.url}-${i}`}>
          <div className="link-icon">
            <div className="no-favicon">
              <Fa icon={faFile} />
            </div>

            <div className="favicon">
              <img
                src={`${(v.url ?? "")
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
          <span className="link-title">{v.title}</span>
        </li>
      );
    }
  );

  return (
    <div className="tabs-setting">
      <div className="tabs-setting-inner-wrap inner-wrap">
        <div className="current-tab-list-wrap list-wrap">
          <div className="current-tab-list-header list-header">
            <h2>Current Tabs</h2>
            <button className="circle-btn">
              <Fa icon={faArchive} />
            </button>
          </div>
          <ul className="current-tab-list list">{mapCurrentTabList}</ul>
        </div>

        <div className="cart-list-wrap list-wrap">
          <div className="cart-list-header list-header">
            <h2>Cart</h2>
            <button className="circle-btn">
              <Fa icon={faTrashAlt} />
            </button>
          </div>
          <ul className="cart-list list"></ul>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
