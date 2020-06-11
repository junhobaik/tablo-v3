/* eslint-disable */
/* eslint-disable no-debugger */
/* eslint no-unused-vars: 0 */
/* eslint @typescript-eslint/no-unused-vars: 0 */
/* eslint no-fallthrough: 0 */
/* eslint no-sparse-arrays: 0 */
// TODO: ESLint에서 async/await를 사용할때 나타나는 오류 해결하기, 임시로 위에서 disable 해둠

import * as React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { faBook, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";

import "./index.scss";
import ContentHeader from "../Content.Header";
import { RootState } from "../../modules";
import {
  Feed,
  FeedItem,
  actionCreators as feedsActionCreators,
} from "../../modules/feeds/actions";
import { actionCreators as globalActionCreators } from "../../modules/global/actions";
import ExpendButton from "../utils/ExpendButton";
import utils from "../utils";

export interface LocalData {
  items: FeedItem[];
  errorFeeds: string[];
  lastLoadDate: string;
}

interface LoadProgress {
  totalProgress: number;
  succeedFeeds: Feed[];
  failedFeeds: Feed[];
}

const Feeds = () => {
  const dispatch = useDispatch();
  const feedsState = useSelector((state: RootState) => state.feeds);
  const globalState = useSelector((state: RootState) => state.global);
  const { linkMethod, reloadPosts, hidePosts } = globalState;
  const { feeds, collections, isChanged, loaded, readPosts } = feedsState;

  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [errorFeedTitleList, setErrorFeedTitleList] = useState<string[]>([]);
  const [loadProgress, setLoadProgress] = useState<LoadProgress>({
    totalProgress: 0,
    succeedFeeds: [],
    failedFeeds: [],
  });

  const postLinkMethod = linkMethod.post === "new" ? "_blank" : "_self";
  const feedLinkMethod = linkMethod.feed === "new" ? "_blank" : "_self";

  const delay = (s: number = 500) => {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve();
      }, s)
    );
  };

  async function loadFeedItem(feed: Feed, retry: boolean = false) {
    const { feedUrl, id } = feed;
    try {
      const fetchURL = `https://api.rss2json.com/v1/api.json?rss_url=${feedUrl}`;
      const response = await fetch(fetchURL);

      if (!response.ok) {
        throw {
          feedTitle: feed.title,
          statusCode: response.status,
          failedCount: feed.faildCount,
        };
      } else {
        dispatch(feedsActionCreators.faildLoadFeed(id, 0));
        const feedData = await response.json();
        const { items } = feedData;
        return items;
      }
    } catch (err) {
      console.error("ERROR: loadFeedItem", err);

      if (retry) return null;
      if (err.statusCode === 422) {
        dispatch(feedsActionCreators.faildLoadFeed(id));
        const error = new Error("url error");
        error.name = "URL-ERROR";
        return error;
      }
      const error = new Error("unknown error");
      error.name = "UNKNOWN-ERROR";
      return error;
    }
  }

  async function loadFeedItemAll(feeds: Feed[]) {
    let i = 0;
    const resultItems: FeedItem[] = [];
    const errorFeeds: string[] = [];

    for (const feed of feeds) {
      let items = await loadFeedItem(feed);
      const isError = items instanceof Error;

      if (isError && (items as Error).name === "UNKNOWN-ERROR") {
        await delay();
        items = await loadFeedItem(feed);
      }

      i += 1;
      setLoadProgress((prev: LoadProgress) => {
        return {
          totalProgress: (i / feeds.length) * 100,
          succeedFeeds: items
            ? [...prev.succeedFeeds, feed]
            : prev.succeedFeeds,
          failedFeeds: items ? prev.failedFeeds : [...prev.failedFeeds, feed],
        };
      });

      await delay();
      if (isError || !items) {
        errorFeeds.push(feed.title);
        continue;
      }

      for (const item of items) {
        const { title, description, pubDate, link } = item;

        resultItems.push({
          title,
          description,
          pubDate: moment(pubDate).format("x"),
          siteUrl: feed.siteUrl,
          siteTitle: feed.title,
          postUrl: link,
          feedID: feed.id,
          collectionID: feed.collectionID ?? "",
        });
      }

      resultItems.sort((a, b) => {
        return Number(b.pubDate) - Number(a.pubDate);
      });

      setFeedItems(resultItems);
    }

    setTimeout(() => {
      setLoadProgress((prev: LoadProgress) => {
        return {
          ...prev,
          totalProgress: 101,
        };
      });
    }, 1000);

    const now = Date.now().toString();

    const localData: LocalData = {
      items: resultItems,
      errorFeeds: errorFeeds,
      lastLoadDate: now,
    };

    utils.setLocalStorage("tablo3_local", localData);
    setErrorFeedTitleList(errorFeeds);

    return;
  }

  const getLocalData = () => {
    const local = utils.getLoaclStorage("tablo3_local");
    const localData: LocalData | null = local ? JSON.parse(local) : null;
    return localData;
  };

  const loadAndSetFeedItems = () => {
    loadFeedItemAll(feeds).then(() => {
      dispatch(feedsActionCreators.setIsChanged(false));
    });
  };

  const filteredFeedItems = _.filter(feedItems, (item) => {
    const collectionVisibility =
      _.find(collections, ["id", item.collectionID])?.visibility ?? true;
    if (!collectionVisibility) return false;

    const feedVisibility =
      _.find(feeds, ["id", item.feedID])?.visibility ?? true;
    if (!feedVisibility) return false;

    if (hidePosts === 0) return true;

    const isOldPost =
      Date.now() - Number(item.pubDate) > 3600000 * 24 * hidePosts;
    if (isOldPost) return false;

    return true;
  });

  const mapToFeedItems = filteredFeedItems.map((item: FeedItem) => {
    const { title, siteUrl, siteTitle, postUrl, pubDate, description } = item;
    const isRead = readPosts.indexOf(postUrl) > -1 ? true : false;

    let pDescription = description;
    if (description.includes("</")) {
      const descriptionDiv = document.createElement("div");
      descriptionDiv.innerHTML = description;
      pDescription = descriptionDiv.innerText;
    }
    pDescription = pDescription.substr(0, 300);

    const toggleDropSpaces = (isShow: boolean) => {
      const dropSpaces = Array.from(
        document.querySelectorAll(".tab-item-wrap>.drop-space")
      ) as HTMLDivElement[];

      for (const d of dropSpaces) {
        d.style.display = isShow ? "flex" : "none";
      }
    };

    return (
      <li
        className={`feed-post ${isRead ? "readed" : "unreaded"}`}
        key={postUrl}
        role="link"
        onClick={() => {
          window.open(postUrl, postLinkMethod);
          dispatch(feedsActionCreators.readPost(postUrl));
        }}
        draggable
        onDragStart={() => {
          dispatch(
            globalActionCreators.setDragData({
              from: "feed-post",
              title,
              url: postUrl,
              description: pDescription,
            })
          );

          toggleDropSpaces(true);
        }}
        onDragEnd={() => {
          toggleDropSpaces(false);
        }}
      >
        <div className="feed-post-header">
          <h2 className="title">{title}</h2>
          <div
            className="btns-wrap"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ExpendButton
              icon={isRead ? faBookOpen : faBook}
              size={5}
              text={isRead ? "Unread" : "Read"}
              clickEvent={() => {
                dispatch(feedsActionCreators.readPost(postUrl, !isRead));
              }}
            />
          </div>
        </div>
        <div className="feed-post-info">
          <span
            className="site-title"
            role="link"
            onClick={(e) => {
              e.stopPropagation();
              window.open(siteUrl, feedLinkMethod);
            }}
          >
            {siteTitle}
          </span>
          <span className="line">|</span>
          <span className="pub-date">{moment(Number(pubDate)).fromNow()}</span>
        </div>
        <span className="feed-post-description">{pDescription}</span>
      </li>
    );
  });

  useEffect(() => {
    if (loaded && !isChanged && feeds.length) {
      const localData: LocalData | null = getLocalData();
      const reloadInterval = 3600000 * reloadPosts;
      // console.log(Date.now() - Number(localData?.lastLoadDate ?? 0), "지남");
      if (!localData) {
        loadAndSetFeedItems();
      } else if (Date.now() - Number(localData.lastLoadDate) > reloadInterval) {
        loadAndSetFeedItems();
      } else {
        setFeedItems(localData?.items ?? []);
        setErrorFeedTitleList(localData?.errorFeeds ?? []);
      }
    }
  }, [loaded]);

  useEffect(() => {
    if (isChanged) loadAndSetFeedItems();
  }, [isChanged]);

  return (
    <div id="Feeds">
      <ContentHeader
        content="feeds"
        searchFunc={() => {}}
        reverse={true}
        loadProgress={loadProgress.totalProgress}
      />
      <div className="feeds-content">
        {feeds.length ? (
          <ol className="feed-post-list">{mapToFeedItems}</ol>
        ) : null}
      </div>
      {errorFeedTitleList.length ? (
        <div className="feeds-error-list">
          <span>Failed to load: {errorFeedTitleList.join(", ")}</span>
        </div>
      ) : null}
    </div>
  );
};

export default Feeds;
