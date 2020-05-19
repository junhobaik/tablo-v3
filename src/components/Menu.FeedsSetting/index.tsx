/* eslint no-unused-vars: 0 */
/* eslint @typescript-eslint/no-unused-vars: 0 */
/* eslint no-sparse-arrays: 0 */
/* eslint no-fallthrough: 0 */

import * as React from "react";
import { useState, useEffect } from "react";
import "./index.scss";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faInfoCircle,
  faTimesCircle,
  faCheckCircle,
  faPlus,
  faAngleDown,
  faAngleUp,
  faTimes,
  faPen,
  faPlusCircle,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import {
  actionCreators as feedsActionCreators,
  FeedForAdd,
  Feed,
} from "../../modules/feeds/actions";
import _ from "lodash";
import { RootState } from "../../modules";

type MessageType = "warn" | "error" | "info" | "success";
interface Message {
  type: MessageType;
  msg: string;
}

const messages = {
  first:
    "Feed URL을 입력해주세요. 반드시 https:// 또는 http:// 로 시작해야합니다.",
  info: "Feed URL을 입력하세요..",
  http: "URL은 반드시 https:// 또는 http:// 로 시작해야합니다.",
  slash: "Feed URL 형식이 맞지 않습니다, '/'의 개수를 확인하세요.",
  error: "Feed 주소가 올바르지 않거나, 지원하지 않는 형식의 Feed입니다.",
  success: "Feed 주소가 확인되었습니다, 추가 정보를 입력하세요.",
};

const FeedsSetting = () => {
  const isDevelopment = false;

  const dispatch = useDispatch();
  const feedsState = useSelector((state: RootState) => state.feeds);
  const { feeds, collections } = feedsState;
  const [addUrlValue, setAddUrlValue] = useState<string>("");
  const [addTitleValue, setTitleValue] = useState<string>("");
  const [validationData, setValidationData] = useState<FeedForAdd | null>(null);
  const [isAddFeedMouseOver, setIsAddFeedMouseOver] = useState<boolean>(false);
  const [isActiveAddFeed, setIsActiveAddFeed] = useState<boolean>(
    isDevelopment ? true : true
  );
  const [message, setMessage] = useState<Message>({
    type: "info",
    msg: messages.first,
  });
  const [editTarget, setEditTarget] = useState<string>("");

  const disableEditFromKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { keyCode } = e;
    if (keyCode === 13 || keyCode === 27) setEditTarget("");
  };

  const addFeedReset = () => {
    setAddUrlValue("");
    setTitleValue("");
    setValidationData(null);
  };

  async function feedUrlValidation(requestUrl: string) {
    try {
      const fetchURL = `https://api.rss2json.com/v1/api.json?rss_url=${requestUrl}`;
      const response = await fetch(fetchURL);
      const feedData = await response.json();

      if (response.ok) {
        if (_.find(feeds, ["feedUrl", feedData.feed.url])) {
          setMessage({
            type: "error",
            msg: `이미 존재하는 피드입니다.`,
          });
        } else {
          setValidationData({
            title: feedData.feed.title ?? "Untitled",
            siteUrl: feedData.feed.link,
            feedUrl: feedData.feed.url,
            collectionId: null,
          });
          setMessage({
            type: "success",
            msg: messages.success,
          });
        }
      } else {
        setMessage({
          type: "error",
          msg: messages.error,
        });
      }
    } catch (err) {
      console.log("err", err);
    }
  }

  const addUrlOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    if (value.length > 8) {
      const isHttp = value.indexOf("http://") > -1;
      const isHttps = value.indexOf("https://") > -1;

      if (isHttp || isHttps) {
        // http 검사 통과
        const slashCnt = (value.match(/\//g) ?? []).length;

        if (slashCnt === 3) {
          // 슬래시 개수 3개, feed url 검사 시작
          setAddUrlValue(value);
          setMessage({
            type: "info",
            msg: messages.info,
          });
        } else if (slashCnt > 3) {
          // 슬래시 개수 초과
          setMessage({
            type: "warn",
            msg: messages.slash,
          });
        } else {
          setAddUrlValue(value);
        }
      } else {
        // http 검사 불통
        setMessage({
          type: "warn",
          msg: messages.http,
        });
      }
    } else {
      setAddUrlValue(value);
      setMessage({
        type: "info",
        msg: messages.info,
      });
    }
  };

  const createFeedList = (feedList: Feed[]) => {
    return feedList.map((f) => {
      const { id, title, visibility, siteUrl } = f;
      return (
        <li
          key={id}
          className="feed-item"
          onMouseEnter={(e) => {
            const btns = e.currentTarget.querySelector(
              ".btns-wrap"
            ) as HTMLDivElement;
            btns.classList.add("show");
          }}
          onMouseLeave={(e) => {
            const btns = e.currentTarget.querySelector(
              ".btns-wrap"
            ) as HTMLDivElement;
            btns.classList.remove("show");
          }}
        >
          <button className="toggle-visiblility-btn" onClick={() => {}}>
            <div className={`inner ${visibility ? "vislble" : "hidden"}`}></div>
          </button>

          <a href={siteUrl}>
            <h3>{title}</h3>
          </a>

          <div className="btns-wrap">
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

  const mapCollections = collections.map((c) => {
    const { id, title, visibility } = c;
    const collectionId = id;
    const feedList = createFeedList(
      _.filter(feeds, ["collectionId", collectionId])
    );

    return (
      <li className="feed-collection" key={collectionId}>
        <div className="feed-collection-header">
          <div className="left">
            <button className="toggle-visiblility-btn" onClick={() => {}}>
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
        <ol className="feed-collection-content">{feedList}</ol>
      </li>
    );
  });

  const mapCollectionsForSelect = collections.map((c) => {
    return (
      <option key={`option-${c.id}`} value={c.id}>
        {c.title}
      </option>
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
    <div className="feeds-setting">
      <div className="add-feed">
        <div
          className={`add-feed-header ${
            isAddFeedMouseOver || isActiveAddFeed ? "hover" : ""
          }`}
        >
          <button
            onMouseEnter={(e) => {
              setIsAddFeedMouseOver(true);
            }}
            onMouseLeave={(e) => {
              setIsAddFeedMouseOver(false);
            }}
            onClick={(e) => {
              setIsAddFeedMouseOver(true);
              setIsActiveAddFeed((prev: boolean) => {
                return !prev;
              });
            }}
          >
            <Fa
              icon={
                isActiveAddFeed
                  ? faAngleUp
                  : isAddFeedMouseOver
                  ? faAngleDown
                  : faPlus
              }
            />
          </button>
          <h2>Add Feed</h2>
        </div>

        {isActiveAddFeed ? (
          <div className="add-feed-content">
            <div className="add-feed-form">
              <div
                className={`add-feed-url-check ${
                  validationData ? "validation" : "invalidation"
                }`}
              >
                <div className="url-input-wrap">
                  <input
                    className="url-input"
                    type="text"
                    placeholder="URL..."
                    value={addUrlValue}
                    disabled={validationData ? true : false}
                    onChange={addUrlOnChange}
                    onFocus={() => {
                      if (!addUrlValue.length) setAddUrlValue("http");
                    }}
                  />
                  {message.type === "success" && validationData ? (
                    <div className="icon-wrap">
                      <Fa icon={faCheckCircle} />
                    </div>
                  ) : null}
                </div>
                <button
                  className="url-check-btn"
                  onClick={() => {
                    if (!validationData) {
                      feedUrlValidation(addUrlValue);
                    } else {
                      setValidationData(null);
                      setMessage({
                        type: "info",
                        msg: messages.first,
                      });
                      setAddUrlValue("");
                    }
                  }}
                >
                  {validationData ? <Fa icon={faTimes} /> : "URL Check"}
                </button>
              </div>

              {(message.type === "success" && validationData) ||
              isDevelopment ? (
                <div className="add-feed-info">
                  <div className="add-feed-info-inputs-wrap">
                    <div className="title-info">
                      <h3>Title</h3>
                      <input
                        type="text"
                        placeholder={
                          validationData ? validationData.title : "TITLE..."
                        }
                        value={addTitleValue}
                        onChange={(e) => {
                          setTitleValue(e.currentTarget.value);
                        }}
                        onFocus={(e) => {
                          if (validationData)
                            setTitleValue(validationData.title);
                        }}
                      />
                    </div>
                    <div className="collection-info">
                      <h3>Collection</h3>
                      <select id="addFeedSelect">
                        {mapCollectionsForSelect.length ? (
                          mapCollectionsForSelect
                        ) : (
                          <option value="new">New collection</option>
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="add-button">
                    <button
                      onClick={() => {
                        const selectEl = document.getElementById(
                          "addFeedSelect"
                        ) as HTMLSelectElement;
                        const title = addTitleValue
                          ? addTitleValue
                          : validationData?.title ?? "Untitled";

                        if (validationData) {
                          dispatch(
                            feedsActionCreators.addFeed({
                              title: title,
                              siteUrl: validationData.siteUrl,
                              feedUrl: validationData.feedUrl,
                              collectionId:
                                selectEl.value === "new"
                                  ? null
                                  : selectEl.value,
                            })
                          );
                          addFeedReset();
                          setMessage({
                            type: "info",
                            msg: `"${title}" 피드가 정상적으로 추가되었습니다.`,
                          });
                        } else {
                          setMessage({
                            type: "error",
                            msg: `알 수 없는 오류가 발생했습니다, URL Check를 다시 해주세요.`,
                          });
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className={`add-feed-message ${message.type}`}>
              <div className={`icon-wrap`}>
                {message.type === "info" ? <Fa icon={faInfoCircle} /> : null}
                {message.type === "warn" ? (
                  <Fa icon={faExclamationCircle} />
                ) : null}
                {message.type === "error" ? <Fa icon={faTimesCircle} /> : null}
                {message.type === "success" ? (
                  <Fa icon={faCheckCircle} />
                ) : null}
              </div>
              <div className="text-wrap">
                <span className="message">{message.msg}</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <ol className="feed-collection-list">
        {mapCollections}
        <div className="add-collection">
          <Fa icon={faPlusCircle} />
        </div>
      </ol>
    </div>
  );
};

export default FeedsSetting;
