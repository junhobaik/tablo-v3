import * as React from 'react';
import { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faCog,
  faPen,
  faTimes,
  faAngleUp,
  faPlusCircle,
  faAngleRight,
  faAngleLeft,
} from '@fortawesome/free-solid-svg-icons';
import { faWindowRestore, faFile } from '@fortawesome/free-regular-svg-icons';
import _ from 'lodash';

import { RootState } from '../../modules';
import { CollectionItem, TabItem, actionCreators } from '../../modules/tabs/actions';
import { actionCreators as globalActionCreators, DragData, DragMoveData } from '../../modules/global/actions';
import ContentHeader from '../Content.Header';
import './index.scss';
import ExpendButton from '../utils/ExpendButton';

const Tabs = () => {
  const dispatch = useDispatch();
  const tabsState = useSelector((state: RootState) => state.tabs);
  const globalState = useSelector((state: RootState) => state.global);
  const [editTarget, setEditTarget] = useState<string | undefined>();

  const { drag, drop, linkMethod } = globalState;
  const { collections, tabs } = tabsState;
  const tabLinkMethod = linkMethod.tab === 'new' ? '_blank' : '_self';
  const collectionLinkMethod = linkMethod.collection === 'new' ? '_blank' : '_self';
  const collectionListData = collections;
  const tabListData = tabs;

  const dragEnterCollectionTabList = (
    e: React.DragEvent<HTMLOListElement>,
    tabItemID: string,
    tabListLength: number
  ) => {
    const dragFrom = (drag as DragData)?.from;
    const dragFromMove = (drag as DragMoveData)?.type;

    if (dragFrom === 'tabs-setting' || dragFrom === 'feed-post' || dragFromMove === 'tabs') {
      const lastPin = e.currentTarget.querySelector('.tab-add-pin.last') as HTMLDivElement | undefined;

      if (lastPin) {
        lastPin.style.display = 'flex';
        lastPin.style.opacity = '1';
      }

      dispatch(
        globalActionCreators.setDropData({
          collection: tabItemID,
          index: tabListLength,
        })
      );
    }
  };

  const dragLeaveCollectionTabList = (e: React.DragEvent<HTMLOListElement>) => {
    const lastPin = e.currentTarget.querySelector('.tab-add-pin.last') as HTMLDivElement | undefined;

    if (lastPin) lastPin.style.display = 'none';
  };

  const toggleFoldedCollection = (id: string) => {
    dispatch(actionCreators.setFoldedCollection(id));
  };

  const toggleAddPin = (e: React.DragEvent<HTMLElement>, isShow: boolean) => {
    const addPin = e.currentTarget.parentElement?.querySelector('.tab-add-pin.front') as HTMLDivElement | undefined;

    if (addPin) addPin.style.opacity = isShow ? '1' : '0';
  };

  const disableEditFromKey = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { keyCode } = e;
    if (keyCode === 13 || keyCode === 27) setEditTarget('');
  };

  const toggleDropSapce = (
    isShow: boolean,
    currentDropSpace: HTMLDivElement | null | undefined = undefined,
    nextDropSpace: HTMLDivElement | null | undefined = undefined
  ) => {
    const dropSpace: HTMLDivElement[] = Array.from(document.querySelectorAll('.drop-space'));

    for (const i in dropSpace) {
      if (!isShow) {
        dropSpace[i].style.display = 'none';
      } else {
        if (currentDropSpace && dropSpace[i] === currentDropSpace) {
          dropSpace[i].style.display = 'none';
        } else if (nextDropSpace && dropSpace[i] === nextDropSpace) {
          dropSpace[i].style.display = 'none';
        } else {
          dropSpace[i].style.display = 'block';
        }
      }
    }
  };

  const createTabList = (tabList: TabItem[], collectionID: string) => {
    return tabList.map((v: TabItem, i: number) => {
      let textMove: NodeJS.Timeout;
      const getIsEdit = () => v.id === editTarget;
      const isEdit = getIsEdit();

      const toggleTabItemMenu = (tabItemEl: HTMLElement, isShow: boolean) => {
        const menu = tabItemEl.querySelector('.tab-menu');
        if (!getIsEdit()) {
          menu?.classList.remove(isShow ? 'hide' : 'show');
          menu?.classList.add(isShow ? 'show' : 'hide');
        }
      };

      const toggleDescrpitionScroll = (e: React.DragEvent<HTMLElement>, isActive: boolean) => {
        const descriptionText = e.currentTarget.querySelector('.tab-description>p') as HTMLParagraphElement;
        descriptionText.style.left = '0px';
        descriptionText.style.position = isActive ? 'absolute' : 'static';
        descriptionText.style.overflow = isActive ? 'auto' : 'hidden';
        if (!isActive && textMove) clearInterval(textMove);
      };

      const dropSpaceDragEvents = {
        dragEnter: (e: React.DragEvent<HTMLDivElement>) => {
          if (
            (drag as DragData)?.from === 'tabs-setting' ||
            (drag as DragData)?.from === 'feed-post' ||
            (drag as DragMoveData)?.type === 'tabs'
          ) {
            toggleAddPin(e, true);

            dispatch(
              globalActionCreators.setDropData({
                collection: collectionID,
                index: i,
              })
            );
          }
        },
        dragLeave: (e: React.DragEvent<HTMLDivElement>) => {
          toggleAddPin(e, false);
        },
        drop: (e: React.DragEvent<HTMLDivElement>) => {
          toggleAddPin(e, false);
          toggleDropSapce(false);

          if (drag && drop) {
            if ((drag as DragData).from) {
              const dragData = drag as DragData;
              dispatch(
                actionCreators.addTabItem({
                  index: drop.index,
                  title: dragData.title,
                  description: '',
                  url: dragData.url,
                  collection: drop.collection,
                })
              );
            }

            if ((drag as DragMoveData).type === 'tabs') {
              const dragMoveData = drag as DragMoveData;
              dispatch(actionCreators.moveTabItem(drop.collection, dragMoveData.id, drop.index));
            }
          }
        },
      };

      const tabItemMouseEvents = {
        mouseEnter: (e: React.MouseEvent) => {
          toggleTabItemMenu(e.currentTarget as HTMLElement, true);
        },
        mouseLeave: (e: React.MouseEvent<HTMLLIElement>) => {
          toggleTabItemMenu(e.currentTarget as HTMLElement, false);
        },
      };

      const tabItemWrapEvents = {
        dragStart: (e: React.DragEvent<HTMLDivElement>) => {
          toggleDescrpitionScroll(e, false);
          const currentDropSpace = e.currentTarget.parentNode?.parentNode?.parentNode?.querySelector('.drop-space') as
            | HTMLDivElement
            | undefined;
          const getNextDropSpace = () => {
            const dropSpaces = Array.from(
              e.currentTarget.parentNode?.parentNode?.parentNode?.parentNode?.querySelectorAll('.drop-space') ?? []
            );
            for (let di in dropSpaces) {
              if (
                currentDropSpace === dropSpaces[Number(di)] &&
                dropSpaces[Number(di) + 1] &&
                currentDropSpace?.classList[1] === dropSpaces[Number(di) + 1].classList[1]
              ) {
                return dropSpaces[Number(di) + 1] as HTMLDivElement;
              }
            }
            return null;
          };
          toggleDropSapce(true, currentDropSpace, getNextDropSpace());
          dispatch(
            globalActionCreators.setDragData({
              type: 'tabs',
              id: v.id,
            })
          );
        },

        dragEnd: (e: React.DragEvent<HTMLDivElement>) => {
          toggleDropSapce(false);
          toggleDescrpitionScroll(e, true);
        },

        mouseDown: (e: React.MouseEvent<HTMLDivElement>) => {
          const menu = e.currentTarget.parentNode?.querySelector('.tab-menu') as HTMLDivElement;
          menu.style.display = 'none';
          setTimeout(() => {
            menu.style.display = 'flex';
          }, 100);
          toggleTabItemMenu(e.currentTarget.parentNode as HTMLElement, true);
        },
      };

      const dexcriptionTextEvents = {
        onMouseEnter: (e: React.MouseEvent<HTMLParagraphElement>) => {
          const parentWidth = (e.currentTarget.parentElement as HTMLDivElement).getBoundingClientRect().width;
          const { left, right } = e.currentTarget.getBoundingClientRect();
          const width = right - left - parentWidth + 10;
          if (width > 10) {
            textMove = setInterval(() => {
              const el = document.getElementById(`description-${v.id}`) as HTMLElement;
              const originLeft = Number(getComputedStyle(el, null).getPropertyValue('left').split('px')[0]);
              if (-width > originLeft - 10) {
                // el.style.left = "0px";
              } else {
                el.style.left = `${originLeft - 10}px`;
              }
            }, 100);
          }
        },
        onMouseLeave: () => {
          if (textMove) {
            const el = document.getElementById(`description-${v.id}`) as HTMLElement;
            el.style.left = '0px';

            clearInterval(textMove);
          }
        },
      };

      return (
        <div
          className="tab-item-wrap"
          key={`tab-${v.id}`}
          onDragEnter={(e) => e.stopPropagation()}
          onDragLeave={(e) => e.stopPropagation()}
        >
          <div
            className="drop-space"
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={dropSpaceDragEvents.dragEnter}
            onDragLeave={dropSpaceDragEvents.dragLeave}
            onDrop={dropSpaceDragEvents.drop}
          ></div>
          <div className="tab-add-pin front">
            <div className="add-icon">
              <Fa icon={faPlusCircle} />
            </div>
            <div className="v-line"></div>
            <div className="up-icon">
              <Fa icon={faAngleUp} />
            </div>
          </div>
          <div className="tab-item-shadow-wrap">
            <li
              className={`tab-item ${isEdit ? 'edit-item' : ''}`}
              onMouseEnter={tabItemMouseEvents.mouseEnter}
              onMouseLeave={tabItemMouseEvents.mouseLeave}
            >
              <div
                className="tab-link-wrap"
                draggable
                onDragStart={tabItemWrapEvents.dragStart}
                onDragEnd={tabItemWrapEvents.dragEnd}
                onMouseDown={tabItemWrapEvents.mouseDown}
              >
                <a
                  className="tab-link"
                  onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                    e.preventDefault();
                    if (!getIsEdit()) window.open(v.url, tabLinkMethod);
                  }}
                >
                  <div className="tab-header">
                    <div className="tab-icon">
                      <div className="no-favicon">
                        <Fa icon={faFile} />
                      </div>

                      <div className="favicon">
                        <img
                          src={`${v.url.split('/').splice(0, 3).join('/')}/favicon.ico`}
                          onError={(e: any) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentNode.parentNode.firstChild.style.display = 'inline-block';
                          }}
                        />
                      </div>
                    </div>
                    <div className="tab-title">
                      {isEdit ? (
                        <textarea
                          cols={2}
                          className="title-input"
                          placeholder={v.title}
                          onKeyDown={(e) => disableEditFromKey(e)}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                            dispatch(actionCreators.editTabItemTitle(v.id, e.currentTarget.value));
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
                        onKeyDown={(e) => disableEditFromKey(e)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          dispatch(actionCreators.editTabItemDescription(v.id, e.currentTarget.value));
                        }}
                      />
                    ) : (
                      <p
                        className="dexcription-text"
                        id={`description-${v.id}`}
                        onMouseEnter={dexcriptionTextEvents.onMouseEnter}
                        onMouseLeave={dexcriptionTextEvents.onMouseLeave}
                      >
                        {v.description}
                      </p>
                    )}
                  </div>
                </a>
              </div>
              <div className={`tab-menu hide ${isEdit ? 'hide' : ''}`}>
                <button className="edit-btn" onClick={() => setEditTarget(v.id)}>
                  <Fa icon={faPen} />
                </button>

                <button className="delete-btn" onClick={() => dispatch(actionCreators.deleteTabItem(v.id))}>
                  <Fa icon={faTimes} />
                </button>
              </div>
            </li>
          </div>
        </div>
      );
    });
  };

  const collectionList = collectionListData.map((v: CollectionItem, i: number) => {
    const isLast = collectionListData.length - 1 <= i;
    const filteredTabs = _.filter(tabListData, { collection: v.id });
    const tabList = createTabList(filteredTabs, v.id);
    const isEdit = v.id === editTarget;

    const toggleDropSpaceAddPin = (e: React.DragEvent<HTMLDivElement>, isShow: boolean) => {
      const addPin = e.currentTarget.firstChild as HTMLDivElement;
      addPin.style.opacity = isShow ? '1' : '0';
    };

    const collectionTabListDragEvents = {
      dragEnter: (e: React.DragEvent<HTMLOListElement>) => {
        e.stopPropagation();
        dragEnterCollectionTabList(e, v.id, tabList.length);
      },

      dragLeave: (e: React.DragEvent<HTMLOListElement>) => {
        dragLeaveCollectionTabList(e);
      },

      drop: (e: React.DragEvent<HTMLOListElement>) => {
        dragLeaveCollectionTabList(e);

        const dragData = drag as DragData;
        const dragDataMove = drag as DragMoveData;

        if (drop && e.currentTarget === e.target) {
          if (dragData?.from === 'tabs-setting' || dragData?.from === 'feed-post') {
            dispatch(
              actionCreators.addTabItem({
                index: null,
                title: dragData.title,
                description: dragData.description,
                url: dragData.url,
                collection: drop.collection,
              })
            );
          }

          if (dragDataMove?.type === 'tabs') {
            dispatch(actionCreators.moveTabItem(drop.collection, dragDataMove.id, drop.index));
            toggleDropSapce(false);
          }
        }
      },
    };

    const dropSpaceDragEvents = {
      dragEnter: (e: React.DragEvent<HTMLDivElement>) => {
        toggleDropSpaceAddPin(e, true);
      },

      dragleave: (e: React.DragEvent<HTMLDivElement>) => {
        toggleDropSpaceAddPin(e, false);
      },

      drop: (e: React.DragEvent<HTMLDivElement>) => {
        toggleDropSpaceAddPin(e, false);
        const dragData = drag as DragMoveData;
        if (dragData) dispatch(actionCreators.moveCollection(dragData.id, i));
      },
    };

    const dropSpaceEl = (
      <div
        className="collection-drop-space"
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={dropSpaceDragEvents.dragEnter}
        onDragLeave={dropSpaceDragEvents.dragleave}
        onDrop={dropSpaceDragEvents.drop}
      >
        <div className="collection-add-pin">
          <div className="left-icon">
            <Fa icon={faAngleRight} />
          </div>
          <div className="right-icon">
            <Fa icon={faAngleLeft} />
          </div>
          <div className="line"></div>
        </div>
      </div>
    );

    return (
      <Fragment key={`collection-${v.id}`}>
        <li className="collection">
          {dropSpaceEl}

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
                      dispatch(actionCreators.editCollectionTitle(v.id, e.currentTarget.value));
                    }}
                  />
                ) : (
                  <h2
                    className="title-text"
                    draggable
                    onDragStart={(e) => {
                      dispatch(
                        globalActionCreators.setDragData({
                          type: 'collection',
                          id: v.id,
                        })
                      );
                      const collection = e.currentTarget.parentNode?.parentNode?.parentNode?.parentNode as
                        | HTMLLIElement
                        | undefined;

                      if (collection) {
                        collection.style.opacity = '0.5';

                        const collections = Array.from(document.querySelectorAll('.collection')) as HTMLLIElement[];

                        if (collections.length) {
                          for (let fi in collections) {
                            const index = Number(fi);
                            if (!(index === i + 1 || index === i)) {
                              const dropSpace = collections[fi].querySelector(
                                '.collection-drop-space'
                              ) as HTMLDivElement;

                              dropSpace.style.display = 'flex';
                            }
                          }
                        }
                      }
                    }}
                    onDragEnd={(e) => {
                      dispatch(globalActionCreators.clearDragData());

                      const collection = e.currentTarget.parentNode?.parentNode?.parentNode?.parentNode as
                        | HTMLLIElement
                        | undefined;

                      if (collection) {
                        collection.style.opacity = '1';
                      }

                      const collections = Array.from(
                        document.querySelectorAll('.collection>.collection-drop-space')
                      ) as HTMLLIElement[];

                      for (const c of collections) {
                        c.style.display = 'none';
                      }
                    }}
                  >
                    {v.title}
                  </h2>
                )}
              </div>
            </div>
            <div className="collection-menu">
              <div className="collection-open-all-wrap">
                <ExpendButton
                  icon={faWindowRestore}
                  text="Open all links"
                  size={8}
                  clickEvent={() => {
                    const links: string[] = [];
                    for (const tab of filteredTabs) {
                      links.push(tab.url);
                    }

                    if (links.length) {
                      if (collectionLinkMethod === '_self') {
                        for (const link of links) {
                          chrome.tabs.create({ url: link });
                        }
                      } else {
                        chrome.windows.create({ url: links, type: 'normal' });
                      }
                    }
                  }}
                />
              </div>
              <div
                className="collection-setting"
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                  // TODO: 차후 중복 제거
                  const expend = e.currentTarget.parentNode?.querySelector('.setting-expend') as
                    | HTMLDivElement
                    | null
                    | undefined;
                  if (expend) {
                    expend.style.top = '-0.75rem';
                    expend.style.opacity = '0';
                    expend.style.pointerEvents = 'none';
                  }
                }}
              >
                <div
                  className="setting-btn circle-btn"
                  onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                    // TODO: 차후 중복 제거
                    const expend = e.currentTarget.parentNode?.querySelector('.setting-expend') as
                      | HTMLDivElement
                      | null
                      | undefined;
                    if (expend) {
                      expend.style.top = '0';
                      expend.style.opacity = '1';
                      expend.style.pointerEvents = 'all';
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
            style={{ display: v.folded ? 'none' : 'flex' }}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={collectionTabListDragEvents.dragEnter}
            onDragLeave={collectionTabListDragEvents.dragLeave}
            onDrop={collectionTabListDragEvents.drop}
          >
            {tabList}

            <div className="tab-item-wrap last">
              <div className="tab-add-pin last">
                <div className="add-icon">
                  <Fa icon={faPlusCircle} />
                </div>
                <div className="v-line"></div>
                <div className="up-icon">
                  <Fa icon={faAngleUp} />
                </div>
              </div>
            </div>
          </ol>
        </li>

        {isLast ? (
          <div className="collection tabs-add-collection">
            {dropSpaceEl}
            <button
              className="add-collection-btn"
              onClick={() => {
                dispatch(actionCreators.addCollection());
              }}
            >
              <Fa icon={faPlusCircle} />
            </button>
          </div>
        ) : null}
      </Fragment>
    );
  });

  useEffect(() => {
    const appBottom = document.querySelector('.app-bottom');
    const disableEdit = (e: Event) => {
      const target = e.target as HTMLElement;
      const tag = target.tagName;
      const isEdit = tag === 'INPUT' || tag === 'TEXTAREA';

      if (!isEdit) setEditTarget('');
    };
    appBottom?.addEventListener('click', disableEdit);

    return () => {
      appBottom?.removeEventListener('click', disableEdit);
    };
  }, []);

  return (
    <div id="Tabs">
      <ContentHeader content="tabs" searchFunc={() => {}} reverse={false} />
      <div className="tabs-content">
        <ol className="collection-list">{collectionList}</ol>
      </div>
    </div>
  );
};

export default Tabs;
