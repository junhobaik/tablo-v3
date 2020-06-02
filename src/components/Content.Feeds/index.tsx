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

interface LocalData {
  items: FeedItem[];
  lastLoadDate: string;
}

const Feeds = () => {
  const dispatch = useDispatch();
  const feedsState = useSelector((state: RootState) => state.feeds);
  const { feeds, isChanged, loaded, readPosts } = feedsState;
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);

  const delay = (s: number) => {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve();
      }, s)
    );
  };

  async function loadFeedItem(feed: Feed) {
    const { feedUrl, id } = feed;
    try {
      const fetchURL = `https://api.rss2json.com/v1/api.json?rss_url=${feedUrl}`;
      const response = await fetch(fetchURL);
      // if (!response.ok) throw { status: response.status };

      const feedData = await response.json();
      const { items } = feedData;

      return items;
    } catch (err) {
      dispatch(feedsActionCreators.faildLoadFeed(id));
      return null;
    }
  }

  async function loadFeedItemAll(feeds: Feed[]) {
    let i = 0;
    const resultItems: FeedItem[] = [];

    for (const feed of feeds) {
      const items = await loadFeedItem(feed);
      await delay(200);

      if (!items) continue;

      for (const item of items) {
        const { title, description, pubDate, link } = item;

        resultItems.push({
          title,
          description,
          pubDate: moment(pubDate).format("x"),
          siteUrl: feed.siteUrl,
          siteTitle: feed.title,
          postUrl: link,
        });
      }
    }

    resultItems.sort((a, b) => {
      return Number(b.pubDate) - Number(a.pubDate);
    });

    const now = Date.now().toString();
    const localData: LocalData = {
      items: resultItems,
      lastLoadDate: now,
    };

    localStorage.setItem("tablo3_local", JSON.stringify(localData));

    return;
  }

  const getLocalData = () => {
    const local = localStorage.getItem("tablo3_local");
    const localData: LocalData | null = local ? JSON.parse(local) : null;
    return localData;
  };

  const loadAndSetFeedItems = () => {
    loadFeedItemAll(feeds).then(() => {
      const localData: LocalData | null = getLocalData();
      dispatch(feedsActionCreators.setIsChanged(false));
      setFeedItems(localData?.items ?? []);
    });
  };

  const mapToFeedItems = feedItems.map((item: FeedItem) => {
    const { title, siteUrl, siteTitle, postUrl, pubDate, description } = item;
    const isRead = readPosts.indexOf(postUrl) > -1 ? true : false;

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
          window.open(postUrl, "_blank");
        }}
        draggable
        onDragStart={() => {
          dispatch(
            globalActionCreators.setDragData({
              from: "feed-post",
              title,
              url: postUrl,
              description,
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
              text={isRead ? "Read" : "Unread"}
              clickEvent={() => {
                console.log(isRead);
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
              window.open(siteUrl, "_blank");
            }}
          >
            {siteTitle}
          </span>
          <span className="line">|</span>
          <span className="pub-date">{moment(Number(pubDate)).fromNow()}</span>
        </div>
        <span className="feed-post-description">{description}</span>
      </li>
    );
  });

  useEffect(() => {
    if (!isChanged && feeds.length) {
      const localData: LocalData | null = getLocalData();
      const reloadInterval = 60000; // TODO: 차후 설정과 연동 3600000 1hour

      console.log(Date.now() - Number(localData?.lastLoadDate ?? 0), "지남");

      if (!localData) {
        loadAndSetFeedItems();
      } else if (Date.now() - Number(localData.lastLoadDate) > reloadInterval) {
        loadAndSetFeedItems();
      } else {
        setFeedItems(localData?.items ?? []);
      }
    }
  }, [loaded]);

  useEffect(() => {
    if (isChanged) loadAndSetFeedItems();
  }, [isChanged]);

  return (
    <div id="Feeds">
      <ContentHeader content="feeds" searchFunc={() => {}} reverse={true} />
      <div className="feeds-content">
        {feeds.length ? (
          <ol className="feed-post-list">{mapToFeedItems}</ol>
        ) : null}
      </div>
    </div>
  );
};

export default Feeds;
