import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { faFile, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faArchive } from "@fortawesome/free-solid-svg-icons";

import { actionCreators as globalActionCreators } from "../../modules/global/actions";
import "./index.scss";
import ExpendButton from "../utils/ExpendButton";

interface CurrentTabItem {
  title: string | undefined;
  url: string | undefined;
  favIconUrl: string | undefined;
}

const Tabs = () => {
  const dispatch = useDispatch();
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

  const toggleDropSapce = (isShow: boolean) => {
    const dropSpace: HTMLDivElement[] = Array.from(
      document.querySelectorAll(".drop-space")
    );
    for (const d of dropSpace) {
      d.style.display = isShow ? "block" : "none";
    }
  };

  const mapCurrentTabList = currentTabList.map(
    (v: CurrentTabItem, i: number) => {
      return (
        <li
          className="link-item"
          key={`link-${v.url}-${i}`}
          draggable
          onDragStart={() => {
            if (v.title && v.url) {
              dispatch(
                globalActionCreators.setDragData({
                  from: "tabs-setting",
                  title: v.title,
                  url: v.url,
                })
              );
              toggleDropSapce(true);
            }
          }}
          onDragEnd={() => {
            dispatch(globalActionCreators.clearDragData());
            dispatch(globalActionCreators.clearDropData());
            toggleDropSapce(false);
          }}
        >
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
            <div className="save-all-link">
              <ExpendButton
                icon={faArchive}
                text="Save all Tabs"
                size={7.5}
                clickEvent={() => {}}
              />
            </div>
          </div>
          <ul className="current-tab-list list">{mapCurrentTabList}</ul>
        </div>

        <div className="cart-list-wrap list-wrap">
          <div className="cart-list-header list-header">
            <h2>Cart</h2>
            <div className="empty-cart">
              <ExpendButton
                icon={faTrashAlt}
                text="Empty Cart"
                size={7}
                clickEvent={() => {}}
              />
            </div>
          </div>
          <ul className="cart-list list"></ul>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
