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
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faWindowRestore, faFile } from "@fortawesome/free-regular-svg-icons";
import _ from "lodash";

import { RootState } from "../../modules";
import {
  CollectionItem,
  TabItem,
  actionCreators,
} from "../../modules/tabs/actions";
import { actionCreators as globalActionCreators } from "../../modules/global/actions";
import ContentHeader from "../Content.Header";
import "./index.scss";
import ExpendButton from "../utils/ExpendButton";

const Tabs = () => {
  const dispatch = useDispatch();
  const tabsState = useSelector((state: RootState) => state.tabs);
  const globalState = useSelector((state: RootState) => state.global);
  const { drag, drop } = globalState;

  const [editTarget, setEditTarget] = useState<string | undefined>();

  const { collections, tabs } = tabsState;
  const collectionListData = collections;
  const tabListData = tabs;

  const dragEnterCollectionTabList = (
    e: React.DragEvent<HTMLOListElement>,
    tabItemID: string,
    tabListLength: number
  ) => {
    const lastPin = e.currentTarget.querySelector(".add-pin.last") as
      | HTMLDivElement
      | undefined;

    if (lastPin) lastPin.style.display = "flex";

    const dragFrom = drag?.from;

    if (dragFrom === "tabs-setting") {
      dispatch(
        globalActionCreators.setDropData({
          collection: tabItemID,
          index: tabListLength,
        })
      );
    }
  };
  const dragLeaveCollectionTabList = (e: React.DragEvent<HTMLOListElement>) => {
    // e.preventDefault();
    const lastPin = e.currentTarget.querySelector(".add-pin.last") as
      | HTMLDivElement
      | undefined;

    if (lastPin) lastPin.style.display = "none";
  };

  const toggleFoldedCollection = (id: string) => {
    dispatch(actionCreators.setFoldedCollection(id));
  };

  const toggleAddPin = (e: React.DragEvent<HTMLElement>, isShow: boolean) => {
    const addPin = e.currentTarget.parentElement?.querySelector(
      ".add-pin.front"
    ) as HTMLDivElement | undefined;

    if (addPin) addPin.style.opacity = isShow ? "1" : "0";
  };

  const disableEditFromKey = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { keyCode } = e;
    if (keyCode === 13 || keyCode === 27) setEditTarget("");
  };

  const createTabList = (tabList: TabItem[], collectionId: string) => {
    const tabListLength = tabList.length;

    return tabList.map((v: TabItem, i: number) => {
      const getIsEdit = () => v.id === editTarget;
      const isEdit = getIsEdit();

      return (
        <div
          className="tab-item-wrap"
          key={`tab-${v.id}`}
          onDragEnter={(e) => {
            e.stopPropagation(); // collection-tab-list
          }}
          onDragLeave={(e) => {
            e.stopPropagation(); // collection-tab-list
          }}
        >
          <div
            className="drop-space"
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDragEnter={(e) => {
              toggleAddPin(e, true);

              if (drag?.from === "tabs-setting") {
                dispatch(
                  globalActionCreators.setDropData({
                    collection: collectionId,
                    index: i,
                  })
                );
              }
            }}
            onDragLeave={(e) => {
              toggleAddPin(e, false);
            }}
            onDrop={(e) => {
              toggleAddPin(e, false);

              if (drag && drop) {
                dispatch(
                  actionCreators.addTabItem({
                    index: drop.index,
                    title: drag.title,
                    description: "",
                    url: drag.url,
                    collection: drop.collection,
                  })
                );
              }
            }}
          ></div>
          <div className="add-pin front">
            <div className="add-icon">
              <Fa icon={faPlusCircle} />
            </div>
            <div className="v-line"></div>
            <div className="up-icon">
              <Fa icon={faAngleUp} />
            </div>
          </div>
          <li
            className={`tab-item ${isEdit ? "edit-item" : ""}`}
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
          {tabListLength - 1 <= i ? (
            <div className="add-pin last">
              <div className="add-icon">
                <Fa icon={faPlusCircle} />
              </div>
              <div className="v-line"></div>
              <div className="up-icon">
                <Fa icon={faAngleUp} />
              </div>
            </div>
          ) : null}
        </div>
      );
    });
  };

  const collectionList = collectionListData.map((v: CollectionItem) => {
    const filteredTabs = _.filter(tabListData, { collection: v.id });
    const tabList = createTabList(filteredTabs, v.id);
    const isEdit = v.id === editTarget;

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
              {isEdit ? (
                <input
                  type="text"
                  className="title-input"
                  placeholder={v.title}
                  onKeyDown={(e) => {
                    disableEditFromKey(e);
                  }}
                  onChange={(e) => {
                    dispatch(
                      actionCreators.editCollectionTitle(
                        v.id,
                        e.currentTarget.value
                      )
                    );
                  }}
                />
              ) : (
                <h2 className="title-text">{v.title}</h2>
              )}
            </div>
          </div>
          <div className="collection-menu">
            <div className="collection-open-all-wrap">
              <ExpendButton
                icon={faWindowRestore}
                text="Open all links"
                size={7.75}
                clickEvent={() => {
                  const links: string[] = [];
                  // TODO: 향후 설정의 모든 탭 열기 방식과 연동
                  // const openMethod: "self" | "blank" = "blank";

                  for (const tab of filteredTabs) {
                    links.push(tab.url);
                  }

                  if (links.length) {
                    chrome.windows.create({ url: links, type: "normal" });

                    // if (openMethod === "self") {
                    //   for (const link of links) {
                    //     chrome.tabs.create({ url: link });
                    //   }
                    // } else {
                    //   chrome.windows.create({ url: links, type: "normal" });
                    // }
                  }
                }}
              />
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
                <button
                  className="edit-btn"
                  onClick={() => {
                    // const collectionHeader =
                    //   e.currentTarget.parentNode?.parentNode?.parentNode
                    //     ?.parentNode;
                    // if (collectionHeader) {
                    //   const titleText = collectionHeader.querySelector(
                    //     ".title-text"
                    //   ) as HTMLHeadingElement;
                    //   const titleInput = collectionHeader.querySelector(
                    //     ".title-input"
                    //   ) as HTMLInputElement;

                    //   titleText.style.display = "none";
                    //   titleInput.style.display = "flex";
                    // }
                    setEditTarget(v.id);
                  }}
                >
                  <Fa icon={faPen} />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => {
                    dispatch(actionCreators.deleteCollection(v.id));
                  }}
                >
                  <Fa icon={faTimes} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <ol
          className="collection-tab-list"
          style={{ display: v.folded ? "none" : "flex" }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDragEnter={(e) => {
            dragEnterCollectionTabList(e, v.id, tabList.length);
          }}
          onDragLeave={dragLeaveCollectionTabList}
          onDrop={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";

            if (drag && drop && e.currentTarget === e.target) {
              dispatch(
                actionCreators.addTabItem({
                  index: null,
                  title: drag.title,
                  description: "",
                  url: drag.url,
                  collection: drop.collection,
                })
              );
            }
          }}
        >
          {tabList}
        </ol>
      </li>
    );
  });

  useEffect(() => {
    // Set Event disableEdit
    const appBottom = document.querySelector(".app-bottom");
    const disableEdit = (e: Event) => {
      const target = e.target as HTMLElement;
      const tag = target.tagName;
      const isEdit = tag === "INPUT" || tag === "TEXTAREA";

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
          <button
            className="add-collection-btn"
            onClick={() => {
              dispatch(actionCreators.addCollection());
            }}
          >
            <Fa icon={faPlusCircle} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
