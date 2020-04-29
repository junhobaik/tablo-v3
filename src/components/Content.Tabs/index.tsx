import * as React from "react";
import { useState, useEffect } from "react";
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

const Tabs = () => {
  const dispatch = useDispatch();
  const tabsState = useSelector((state: RootState) => state.tabs);

  const [editTarget, setEditTarget] = useState<string | undefined>();

  const { collections, tabs } = tabsState;
  const collectionListData = collections;
  const tabListData = tabs;

  const toggleFoldedCollection = (id: string) => {
    dispatch(actionCreators.setFoldedCollection(id));
  };

  const createTabList = (tabList: TabItem[]) => {
    return tabList.map((v: TabItem) => {
      const getIsEdit = () => v.id === editTarget;
      const isEdit = getIsEdit();

      const disableEditFromKey = (
        e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        const { keyCode } = e;
        if (keyCode === 13 || keyCode === 27) setEditTarget("");
      };

      return (
        <li
          className={`tab-item ${isEdit ? "edit-item" : ""}`}
          key={`tab-${v.id}`}
          onMouseEnter={(e: React.MouseEvent) => {
            const menu = e.currentTarget.querySelector(".tab-menu");
            if (!getIsEdit()) {
              menu?.classList.remove("hide");
              menu?.classList.add("show");
            }
          }}
          onMouseLeave={(e: React.MouseEvent) => {
            const menu = e.currentTarget.querySelector(".tab-menu");
            if (!getIsEdit()) {
              menu?.classList.remove("show");
              menu?.classList.add("hide");
            }
          }}
        >
          <a
            className="tab-link"
            onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
              e.preventDefault();
              if (!getIsEdit()) window.open(v.url, "_self");
            }}
          >
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
              <div className="tab-title">
                {/* FIXME: textarea와 span 전환시 미묘한 위치 안맞음이 있는 이슈 */}
                {isEdit ? (
                  <textarea
                    cols={2}
                    className="title-input"
                    placeholder={v.title}
                    onKeyDown={(e) => {
                      disableEditFromKey(e);
                    }}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      dispatch(
                        actionCreators.editTabItemTitle(
                          v.id,
                          e.currentTarget.value
                        )
                      );
                    }}
                  />
                ) : (
                  <span className="title-text">{v.title}</span>
                )}
              </div>
            </div>
            <div className="tab-description">
              {isEdit ? (
                <input
                  type="text"
                  className="description-input"
                  placeholder={v.description}
                  onKeyDown={(e) => {
                    disableEditFromKey(e);
                  }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    dispatch(
                      actionCreators.editTabItemDescription(
                        v.id,
                        e.currentTarget.value
                      )
                    );
                  }}
                />
              ) : (
                <p className="dexcription-text">{v.description}</p>
              )}
            </div>
          </a>
          <div className={`tab-menu hide ${isEdit ? "hide" : ""}`}>
            <button
              className="edit-btn"
              onClick={() => {
                setEditTarget(v.id);
              }}
            >
              <Fa icon={faPen} />
            </button>

            <button
              className="delete-btn"
              onClick={() => {
                dispatch(actionCreators.deleteTabItem(v.id));
              }}
            >
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
          <div className="collection-title-wrap">
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
            <div className="collection-title">
              <h2 className="title-text">{v.title}</h2>
              <input
                type="text"
                className="title-input"
                placeholder={v.title}
              />
            </div>
          </div>
          <div className="collection-menu">
            <div className="collection-open-all">
              <button className="open-all-btn circle-btn">
                <Fa icon={faWindowRestore} />
              </button>
            </div>
            <div
              className="collection-setting"
              onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                // TODO: 차후 중복 제거
                const expend = e.currentTarget.parentNode?.querySelector(
                  ".setting-expend"
                ) as HTMLDivElement | null | undefined;
                if (expend) {
                  expend.style.top = "-0.75rem";
                  expend.style.opacity = "0";
                  expend.style.pointerEvents = "none";
                }
              }}
            >
              <div
                className="setting-btn circle-btn"
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                  // TODO: 차후 중복 제거
                  const expend = e.currentTarget.parentNode?.querySelector(
                    ".setting-expend"
                  ) as HTMLDivElement | null | undefined;
                  if (expend) {
                    expend.style.top = "0";
                    expend.style.opacity = "1";
                    expend.style.pointerEvents = "all";
                  }
                }}
              >
                <Fa icon={faCog} />
              </div>
              <div className="setting-expend">
                <div className="space-circle"></div>
                <button className="edit-btn">
                  <Fa icon={faPen} />
                </button>
                <button className="delete-btn">
                  <Fa icon={faTimes} />
                </button>
              </div>
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

  useEffect(() => {
    const appBottom = document.querySelector(".app-bottom");
    const disableEdit = (e: Event) => {
      let parent = e.target as HTMLElement | null;
      let isEdit: boolean = false;

      while (
        (parent && parent !== e.currentTarget) ||
        parent?.classList.contains("tab-item")
      ) {
        parent = parent.parentElement;
        if (parent?.classList.contains("edit-item")) isEdit = true;
      }

      if (!isEdit) setEditTarget("");
    };
    appBottom?.addEventListener("click", disableEdit);

    return () => {
      appBottom?.removeEventListener("click", disableEdit);
    };
  }, []);

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
