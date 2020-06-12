import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { faFile, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faArchive, faTimes } from "@fortawesome/free-solid-svg-icons";

import { actionCreators as globalActionCreators } from "../../modules/global/actions";
import "./index.scss";
import ExpendButton from "../utils/ExpendButton";
import {
  actionCreators as tabsActionCreators,
  SimpleItem,
  actionCreators,
} from "../../modules/tabs/actions";
import { RootState } from "../../modules";

const Tabs = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.tabs.cart);
  const [currentTabList, setCurrentTabList] = useState<SimpleItem[]>([]);

  const getAllTabs = () => {
    chrome.windows.getAll({ populate: true }, (windows) => {
      const list: SimpleItem[] = [];
      for (const window of windows) {
        if (window?.tabs) {
          for (const tab of window.tabs) {
            const { title, url } = tab;
            if (url && url !== "chrome://newtab/")
              list.push({ title: title ?? "Untitled", url });
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

  const createList = (list: SimpleItem[], deletable: boolean = false) => {
    return list.map((v: SimpleItem, i: number) => {
      const toggleDeleteButton = deletable
        ? (e: React.MouseEvent<HTMLLIElement>, isShow: boolean) => {
            const deleteBtn = e.currentTarget.lastChild as HTMLButtonElement;
            deleteBtn.classList.remove(isShow ? "hide" : "show");
            deleteBtn.classList.add(isShow ? "show" : "hide");
          }
        : (e: React.MouseEvent<HTMLLIElement>) => {
            e.preventDefault();
          };

      return (
        <li
          className="link-item"
          key={`link-${v.url}-${i}`}
          onMouseEnter={(e) => {
            toggleDeleteButton(e, true);
          }}
          onMouseLeave={(e) => {
            toggleDeleteButton(e, false);
          }}
          draggable
          onDragStart={() => {
            if (v.title && v.url) {
              dispatch(
                globalActionCreators.setDragData({
                  from: "tabs-setting",
                  title: v.title,
                  url: v.url,
                  description: "",
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
          {deletable ? (
            <button
              className="delete-btn hide"
              onClick={() => {
                dispatch(actionCreators.deleteCartItem(v.url));
              }}
            >
              <Fa icon={faTimes} />
            </button>
          ) : null}
        </li>
      );
    });
  };

  const mapCurrentTabList = createList(currentTabList);
  const mapCartList = createList(cart, true);

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
                size={8.5}
                clickEvent={() => {
                  const items = currentTabList as SimpleItem[];
                  dispatch(tabsActionCreators.tabsArchive(items));
                }}
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
                size={8}
                clickEvent={() => {
                  dispatch(actionCreators.emptyCart());
                }}
              />
            </div>
          </div>
          <ul className="cart-list list">{mapCartList}</ul>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
