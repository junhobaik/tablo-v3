import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faPen,
  faPlusCircle,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import {
  actionCreators as feedsActionCreators,
  FeedTargetType,
  FeedsState,
  Collection,
} from "../../../modules/feeds/actions";
import _ from "lodash";
import { GlobalState } from "../../../modules/global/reducer";
import { actionCreators as globalActionCreators } from "../../../modules/global/actions";
import FeedItem from "./FeedItem";
import { DragMoveData } from "../../../modules/global/actions";

const FeedCollection = ({
  feedsState,
  globalState,
}: {
  feedsState: FeedsState;
  globalState: GlobalState;
}) => {
  const { feeds, collections } = feedsState;
  const { drag, drop } = globalState;

  const dispatch = useDispatch();
  const [editTarget, setEditTarget] = useState<string>("");

  const toggleVisiblity = (id: string, target: FeedTargetType) => {
    dispatch(feedsActionCreators.toggleVisibility(id, target));
  };

  const disableEditFromKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { keyCode } = e;
    if (keyCode === 13 || keyCode === 27) setEditTarget("");
  };

  const createDropSpace = (collectionIndex: number) => {
    return (
      <div
        className={`feed-collection-drop-space ds-${collectionIndex}`}
        onDragEnter={(e) => {
          e.currentTarget.style.borderTop = "3px solid #4770da";
          const dragData = drag as DragMoveData | null;

          if (dragData?.type === "feeds-setting-collection") {
            dispatch(
              globalActionCreators.setDropData({
                collection: "", //
                index: collectionIndex,
              })
            );
          }
        }}
        onDragLeave={(e) => {
          e.currentTarget.style.borderTop = "3px solid transparent";
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.currentTarget.style.borderTop = "3px solid transparent";

          const dragData = drag as DragMoveData | null;

          if (drop && dragData?.type === "feeds-setting-collection") {
            dispatch(
              feedsActionCreators.moveFeedCollection(dragData.id, drop.index)
            );
          }
        }}
      ></div>
    );
  };

  // >collection
  const mapCollections = collections.map((c: Collection, i: number) => {
    const { id, title, visibility } = c;
    const collectionID = id;
    const feedList = _.filter(feeds, ["collectionID", collectionID]);

    const toggleAddPin = (e: React.DragEvent<HTMLElement>, isShow: boolean) => {
      const lastAddPin = e.currentTarget.querySelector(
        ".last-add-pin-wrap>.add-pin"
      ) as HTMLDivElement;
      lastAddPin.style.opacity = isShow ? "1" : "0";
    };

    const titleDragStyleEvents = (
      e: React.DragEvent<HTMLElement>,
      isDragStart: boolean
    ) => {
      const left = e.currentTarget.parentNode as HTMLDivElement;
      const feedCollectionHeader = left.parentNode as HTMLDivElement;
      const feedCollection = feedCollectionHeader.parentNode as HTMLElement;
      const feedCollectionList = feedCollection.parentNode as HTMLOListElement;
      const collectionDropSapces = feedCollectionList.querySelectorAll(
        ".feed-collection-drop-space"
      ) as NodeListOf<HTMLDivElement>;

      if (isDragStart) {
        const currentDropSpace: HTMLDivElement = collectionDropSapces[i];
        const nextDropSpaces = collectionDropSapces[i + 1] as
          | HTMLDivElement
          | undefined;

        const filteredDropSapces = _.filter(collectionDropSapces, (d) => {
          if (d !== currentDropSpace && d !== nextDropSpaces) return true;
          return false;
        });

        feedCollection.style.opacity = "0.5";
        for (const d of filteredDropSapces) {
          d.style.display = "flex";
        }
      } else {
        feedCollection.style.opacity = "1";
        const dropSapces = Array.from(collectionDropSapces);
        for (const d of dropSapces) {
          d.style.display = "none";
        }
      }
    };

    return (
      <li className="feed-collection" key={collectionID}>
        {createDropSpace(i)}
        <div className="feed-collection-header">
          <div className="left">
            <button
              className="toggle-visiblility-btn"
              onClick={() => {
                toggleVisiblity(id, "collection");
              }}
            >
              <div
                className={`inner ${visibility ? "vislble" : "hidden"}`}
              ></div>
            </button>
            {editTarget === id ? (
              <input
                type="text"
                className="collection-title-input"
                onKeyDown={(e) => {
                  disableEditFromKey(e);
                }}
                onChange={(e) => {
                  dispatch(
                    feedsActionCreators.editTitleCollection(
                      id,
                      e.currentTarget.value
                    )
                  );
                }}
                placeholder={title}
              />
            ) : (
              <h2
                className="collection-title-text"
                draggable
                onDragStart={(e) => {
                  dispatch(
                    globalActionCreators.setDragData({
                      type: "feeds-setting-collection",
                      id: collectionID,
                    })
                  );

                  titleDragStyleEvents(e, true);
                }}
                onDragEnd={(e) => {
                  dispatch(globalActionCreators.clearDragData());
                  dispatch(globalActionCreators.clearDropData());

                  titleDragStyleEvents(e, false);
                }}
              >
                {title}
              </h2>
            )}
          </div>

          <div
            className="right"
            onMouseLeave={(e) => {
              const expend = e.currentTarget.querySelector(
                ".expend"
              ) as HTMLDivElement;
              expend.classList.remove("show");
            }}
          >
            <div className="expend">
              <button
                className="delete-btn"
                onClick={() => {
                  dispatch(feedsActionCreators.deleteCollection(id));
                }}
              >
                <Fa icon={faTimes} />
              </button>
              <button
                className="edit-btn"
                onClick={() => {
                  setEditTarget(id);
                }}
              >
                <Fa icon={faPen} />
              </button>
            </div>
            <div
              className="cog"
              onMouseEnter={(e) => {
                const expend = (e.currentTarget
                  .parentNode as HTMLDivElement).querySelector(
                  ".expend"
                ) as HTMLDivElement;
                expend.classList.add("show");
              }}
            >
              <Fa icon={faCog} />
            </div>
          </div>
        </div>
        <ol
          className="feed-collection-content"
          onDragEnter={(e) => {
            const dragData = drag as DragMoveData | null;

            if (dragData?.type === "feeds-setting-feed") {
              toggleAddPin(e, true);
              dispatch(
                globalActionCreators.setDropData({
                  collection: collectionID,
                  index: feedList.length,
                })
              );
            }
          }}
          onDragLeave={(e) => {
            toggleAddPin(e, false);
          }}
          onDrop={(e) => {
            toggleAddPin(e, false);

            const dragData = drag as DragMoveData | null;

            if (drop && dragData?.type === "feeds-setting-feed") {
              dispatch(
                feedsActionCreators.moveFeedItem(
                  drop.collection,
                  dragData.id,
                  drop.index
                )
              );
            }

            const dropSpaces = Array.from(
              document.querySelectorAll(".drop-space")
            ) as HTMLDivElement[];
            for (const d of dropSpaces) {
              d.style.display = "none";
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
        >
          <FeedItem
            feedList={feedList}
            collectionId={collectionID}
            collectionVisibility={visibility}
            toggleVisiblity={toggleVisiblity}
            disableEditFromKey={disableEditFromKey}
            drag={drag as DragMoveData | null}
            drop={drop}
            editTarget={editTarget}
            setEditTarget={setEditTarget}
          />
        </ol>
      </li>
    );
  });

  useEffect(() => {
    // TODO: input에 변화가 있었다면 isChanged true로 새로 불러오도록 구현할 것 (collection 수정 제외)
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
    <ol className="feed-collection-list">
      {mapCollections}
      <div className="add-collection">
        {createDropSpace(collections.length)}
        <button
          className="add-collection-btn"
          onClick={() => {
            dispatch(feedsActionCreators.addCollection());
          }}
        >
          <Fa icon={faPlusCircle} />
        </button>
      </div>
    </ol>
  );
};

export default FeedCollection;
