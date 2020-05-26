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
} from "../../../modules/feeds/actions";
import _ from "lodash";
import { GlobalState } from "../../../modules/global/reducer";
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

  // >collection
  const mapCollections = collections.map((c) => {
    const { id, title, visibility } = c;
    const collectionId = id;
    const feedList = _.filter(feeds, ["collectionId", collectionId]);

    return (
      <li className="feed-collection" key={collectionId}>
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
              <h2>{title}</h2>
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
            const lastAddPin = e.currentTarget.querySelector(
              ".last-add-pin-wrap>.add-pin"
            ) as HTMLDivElement;
            lastAddPin.style.opacity = "1";
          }}
          onDragLeave={(e) => {
            const lastAddPin = e.currentTarget.querySelector(
              ".last-add-pin-wrap>.add-pin"
            ) as HTMLDivElement;
            lastAddPin.style.opacity = "0";
          }}
          onDrop={(e) => {
            const lastAddPin = e.currentTarget.querySelector(
              ".last-add-pin-wrap>.add-pin"
            ) as HTMLDivElement;
            lastAddPin.style.opacity = "0";
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
        >
          <FeedItem
            feedList={feedList}
            collectionId={collectionId}
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
