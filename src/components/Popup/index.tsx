/* eslint @typescript-eslint/no-unused-vars: 0 */
/* eslint no-fallthrough: 0 */
/* eslint no-sparse-arrays: 0 */
/* eslint no-unused-vars: 0 */

import * as React from "react";
import { useState, useEffect } from "react";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-regular-svg-icons";

import { hot } from "react-hot-loader";
import "./index.scss";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { RootState } from "../../modules";
import _ from "lodash";

interface Site {
  title: string;
  url: string;
  favIconUrl: string | undefined;
}

interface Feed {
  title: string;
  siteUrl: string;
  feedUrl: string;
}

const Popup = () => {
  const [site, setSite] = useState<Site>();
  const [feed, setFeed] = useState<Feed>();
  const [isFeedSearchDone, setIsFeedSearchDone] = useState(false);
  const [siteTitle, setSiteTitle] = useState<string>("");
  const [feedTitle, setFeedTitle] = useState<string>("");
  const [state, setState] = useState<RootState>();
  const [firstLoadDone, setFirstLoadDone] = useState<boolean>(false);
  const [containFeeds, setContainFeeds] = useState<boolean>(false);
  const [requestError, setRequestError] = useState<boolean>(false);

  const delay = (s: number = 2500) => {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve();
      }, s)
    );
  };

  const feedCheck = async (siteUrl: string) => {
    const url = siteUrl.split("/").splice(0, 3).join("/");
    const urlCheck = ["feed", "rss", "feed.xml", "rss.xml", "d2.atom"];

    const request = async (c: string, count: number = 0) => {
      try {
        const requestUrl = `https://api.rss2json.com/v1/api.json?rss_url=${url}/${c}`;
        const response = await fetch(requestUrl);

        if (response.ok) {
          const feedData = await response.json();
          const { title } = feedData.feed;

          setFeed({
            title: title ?? "Untitled",
            siteUrl: url,
            feedUrl: `${url}/${c}`,
          });
          setFeedTitle(title ?? "Untitled");

          return response.status;
        } else {
          throw response.status;
        }
      } catch (status) {
        if (typeof status !== "number") {
          if (count > 5) {
            console.log("요청 과다");
            return "error";
          }
          await delay(3000);
          await request(c, count + 1);
        } else {
          return null;
        }
      }
    };

    for (const c of urlCheck) {
      const result = await request(c);
      if (result === "error") {
        setRequestError(true);
        break;
      }
      await delay(3000);
    }

    return false;
  };

  useEffect(() => {
    if (firstLoadDone) {
      // chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      chrome.tabs.query({ currentWindow: false, active: true }, function (
        tabs
      ) {
        const { title, url, favIconUrl } = tabs[0];

        setSite({
          title: title ?? "Untitled",
          url: url ?? "",
          favIconUrl,
        });
        setSiteTitle(title ?? "Untitled");
        const findedFeeds = _.find(state?.feeds.feeds, [
          "siteUrl",
          url?.split("/").splice(0, 3).join("/"),
        ]);
        console.log(findedFeeds);
        setContainFeeds(findedFeeds ? true : false);

        if (url && !findedFeeds) {
          feedCheck(url).then(() => {
            setIsFeedSearchDone(true);
          });
        }
      });
    } else {
      chrome.storage.sync.get("tablo3", (res) => {
        if (res.tablo3) {
          setState(res.tablo3);
          setFirstLoadDone(true);
        }
      });
    }
  }, [firstLoadDone]);

  return (
    <div id="Popup">
      <h1>Tablo</h1>
      {site && site.url.length ? (
        <>
          <h2>Add Link to Tabs</h2>
          <div className="site item-wrap">
            <div className="favicon-wrap">
              <div className="no-favicon">
                <Fa icon={faFile} />
              </div>
              <img
                className="favicon"
                src={site.favIconUrl ?? ""}
                onError={(e: any) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentNode.firstChild.style.display = "flex";
                }}
              />
            </div>

            <input
              type="text"
              className="title-input"
              value={siteTitle}
              placeholder={site.title}
              onChange={(e) => {
                setSiteTitle(e.currentTarget.value);
              }}
            />

            <div className="add-submit submit">
              <select>
                <option value="cart">Cart</option>
              </select>
              <button>
                <Fa icon={faPlus} />
              </button>
            </div>
          </div>

          <h2>Add Feed to Feeds</h2>
          {isFeedSearchDone ? (
            <div className="add-feed">
              {feed ? (
                <div className="feed item-wrap">
                  <div className="favicon-wrap">
                    <div className="no-favicon">
                      <Fa icon={faFile} />
                    </div>
                    <img
                      className="favicon"
                      src={`${feed.siteUrl}/favicon.ico` ?? ""}
                      onError={(e: any) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.parentNode.firstChild.style.display =
                          "flex";
                      }}
                    />
                  </div>

                  <input
                    type="text"
                    className="title-input"
                    value={feedTitle}
                    placeholder={feed.title}
                    onChange={(e) => {
                      setFeedTitle(e.currentTarget.value);
                    }}
                  />
                  <div className="submit">
                    <select>
                      <option value="collection">collection</option>
                    </select>
                    <button>
                      <Fa icon={faPlus} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="no-feed">
                  <span>피드 주소를 확인 할 수 없습니다.</span>
                </div>
              )}
            </div>
          ) : containFeeds ? (
            <div className="contain-feed">
              <span>이미 존재하는 FEED.</span>
            </div>
          ) : requestError ? (
            <div className="request-error">
              <span>죄송합니다, 요청 오류 발생.</span>
            </div>
          ) : (
            <div className="search-feed">
              <span>FEED 주소 검색 중...</span>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};

export default hot(module)(Popup);
