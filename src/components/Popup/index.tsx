/* eslint no-fallthrough: 0 */
/* eslint no-sparse-arrays: 0 */
// async / await

import * as React from 'react';
import { useState, useEffect } from 'react';
import { hot } from 'react-hot-loader';
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import { faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import './index.scss';
import { RootState } from '../../modules';
import { Collection, FeedForAdd } from '../../modules/feeds/actions';
import { CollectionItem, SimpleItem, TabItemForAdd } from '../../modules/tabs/actions';
import utils from '../../utils';

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
  const [t] = useTranslation();
  const [site, setSite] = useState<Site>();
  const [siteTitle, setSiteTitle] = useState<string>('');
  const [isTabSubmitDone, setIsTabSubmitDone] = useState<boolean>(false);

  const [feed, setFeed] = useState<Feed>();
  const [feedTitle, setFeedTitle] = useState<string>('');
  const [containFeeds, setContainFeeds] = useState<boolean>(false);
  const [requestError, setRequestError] = useState<boolean>(false);
  const [isFeedSearchDone, setIsFeedSearchDone] = useState<boolean>(false);
  const [isFeedSubmitDone, setIsFeedSubmitDone] = useState<boolean>(false);
  const [urlCheckProgress, setUrlCheckProgress] = useState<number>(0);

  const [firstLoadDone, setFirstLoadDone] = useState<boolean>(false);
  const [state, setState] = useState<RootState>();

  const tabsCollections = state?.tabs.collections ?? [];
  const feedsCollections = state?.feeds.collections ?? [];

  const delay = (s: number = 1000) => {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve();
      }, s)
    );
  };

  const feedCheck = async (siteUrl: string) => {
    const url = siteUrl.split('/').splice(0, 3).join('/');
    const urlCheck = ['feed', 'rss', 'feed.xml', 'rss.xml', 'd2.atom'];
    let i = 0;
    let urlCheckLength = urlCheck.length;

    const request = async (c: string, count: number = 0) => {
      try {
        const requestUrl = `https://api.rss2json.com/v1/api.json?rss_url=${url}/${c}`;
        const response = await fetch(requestUrl);

        if (response.ok) {
          const feedData = await response.json();
          const { title } = feedData.feed;

          setFeed({
            title: title ?? 'Untitled',
            siteUrl: url,
            feedUrl: `${url}/${c}`,
          });
          setFeedTitle(title ?? 'Untitled');

          await delay(500);
          setUrlCheckProgress(100);

          return response.status;
        } else {
          throw response.status;
        }
      } catch (status) {
        if (typeof status !== 'number') {
          if (count > 5) {
            return 'error';
          }
          await delay(2000);
          await request(c, count + 1);
        } else {
          return null;
        }
      }
    };

    for (const c of urlCheck) {
      const result = await request(c);

      if (result === 'error') {
        setRequestError(true);
        setUrlCheckProgress(0);
        break;
      }

      i += 1;
      setUrlCheckProgress((i / urlCheckLength) * 100);
      await delay();
    }

    return false;
  };

  const addToState = (type: 'feeds' | 'tabs', collectionID: string, data: SimpleItem | TabItemForAdd | FeedForAdd) => {
    setState((prev: RootState | undefined) => {
      if (prev) {
        if (type === 'tabs') {
          switch (collectionID) {
            case 'cart': {
              const cartData = data as SimpleItem;
              return {
                ...prev,
                tabs: {
                  ...prev.tabs,
                  cart: [...prev.tabs.cart, cartData],
                },
              };
            }

            case 'new': {
              const tabData = data as TabItemForAdd;
              const newCollectionID = uuidv4();
              return {
                ...prev,
                tabs: {
                  ...prev.tabs,
                  tabs: [
                    ...prev.tabs.tabs,
                    {
                      id: uuidv4(),
                      title: tabData.title,
                      description: '',
                      url: tabData.url,
                      collection: newCollectionID,
                    },
                  ],
                  collections: [
                    ...prev.tabs.collections,
                    {
                      id: newCollectionID,
                      title: `Collection [${moment().format('YYMMDD HH:mm:ss')}]`,
                      folded: false,
                    },
                  ],
                },
              };
            }

            default: {
              const tabData = data as TabItemForAdd;
              return {
                ...prev,
                tabs: {
                  ...prev.tabs,
                  tabs: [
                    ...prev.tabs.tabs,
                    {
                      id: uuidv4(),
                      title: tabData.title,
                      description: tabData.description,
                      url: tabData.url,
                      collection: collectionID,
                    },
                  ],
                },
              };
            }
          }
        }

        if (type === 'feeds') {
          let result;

          switch (collectionID) {
            case 'new': {
              const feedData = data as FeedForAdd;
              const newCollectionID = uuidv4();
              result = {
                ...prev,
                feeds: {
                  ...prev.feeds,
                  feeds: [
                    ...prev.feeds.feeds,
                    {
                      id: uuidv4(),
                      title: feedData.title,
                      feedUrl: feedData.feedUrl,
                      siteUrl: feedData.siteUrl,
                      collectionID: newCollectionID,
                      visibility: true,
                      faildCount: 0,
                    },
                  ],
                  collections: [
                    ...prev.feeds.collections,
                    {
                      id: newCollectionID,
                      title: `Collection [${moment().format('YYMMDD HH:mm:ss')}]`,
                      visibility: true,
                    },
                  ],
                },
              };
              break;
            }
            default: {
              const feedData = data as FeedForAdd;
              result = {
                ...prev,
                feeds: {
                  ...prev.feeds,
                  feeds: [
                    ...prev.feeds.feeds,
                    {
                      id: uuidv4(),
                      title: feedData.title,
                      feedUrl: feedData.feedUrl,
                      siteUrl: feedData.siteUrl,
                      collectionID,
                      visibility: true,
                      faildCount: 0,
                    },
                  ],
                },
              };
              break;
            }
          }
          utils.setLocalStorage('tablo3_reload-posts', true);
          return result;
        }

        return prev;
      }

      return;
    });
  };

  const createSelectOptions = (list: any[]) => {
    if (list.length) {
      return list.map((c: CollectionItem | Collection) => {
        return (
          <option value={c.id} key={`link-option-${c.id}`}>
            {c.title}
          </option>
        );
      });
    } else {
      return <option value="new">New Collection</option>;
    }
  };

  const tabsCollectionOptions = createSelectOptions(tabsCollections);
  const feedsCollectionOptions = createSelectOptions(feedsCollections);

  useEffect(() => {
    if (firstLoadDone) {
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        const { title, url, favIconUrl } = tabs[0];

        setSite({
          title: title ?? 'Untitled',
          url: url ?? '',
          favIconUrl,
        });
        setSiteTitle(title ?? 'Untitled');
        const findedFeeds = _.find(state?.feeds.feeds, ['siteUrl', url?.split('/').splice(0, 3).join('/')]);
        setContainFeeds(findedFeeds ? true : false);

        if (url && !findedFeeds) {
          feedCheck(url).then(() => {
            setIsFeedSearchDone(true);
          });
        }
      });
    } else {
      chrome.storage.sync.get('tablo3', (res) => {
        if (res.tablo3) {
          setState(res.tablo3);
          setFirstLoadDone(true);
        }
      });
    }
  }, [firstLoadDone]);

  useEffect(() => {
    if (firstLoadDone) {
      chrome.storage.sync.set(
        {
          tablo3: state,
        },
        () => {
          utils.setLocalStorage('tablo3_changed', 'true');
        }
      );
    }
  }, [state]);

  return (
    <div id="Popup">
      <h1>Tablo</h1>
      {site && site.url.length ? (
        <>
          <h2>{t('popup-add_link')}</h2>
          <div className="site item-wrap">
            <div className="favicon-wrap">
              <div className="no-favicon">
                <Fa icon={faFile} />
              </div>
              <img
                className="favicon"
                src={site.favIconUrl ?? ''}
                onError={(e: any) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentNode.firstChild.style.display = 'flex';
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
              <select id="tabsCollectionSelect" defaultValue="cart">
                <option value="cart">Cart</option>
                {tabsCollectionOptions}
              </select>
              <button
                className={`submit-btn${isTabSubmitDone ? ' submit-done' : ''}`}
                onClick={(e) => {
                  const submit = e.currentTarget.parentNode as HTMLDivElement;
                  const select = submit.firstChild as HTMLSelectElement;
                  const collectionID = select.value;
                  const data =
                    collectionID === 'cart'
                      ? { url: site.url, title: siteTitle }
                      : {
                          title: siteTitle,
                          description: '',
                          url: site.url,
                          collection: collectionID,
                        };
                  addToState('tabs', select.value, data);
                  setIsTabSubmitDone(true);
                }}
              >
                <Fa icon={isTabSubmitDone ? faCheck : faPlus} />
              </button>
            </div>
          </div>

          <h2>{t('popup-add_feed')}</h2>
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
                      src={`${feed.siteUrl}/favicon.ico` ?? ''}
                      onError={(e: any) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentNode.firstChild.style.display = 'flex';
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
                    <select id="feedsCollectionSelect">{feedsCollectionOptions}</select>
                    <button
                      className={`submit-btn${isFeedSubmitDone ? ' submit-done' : ''}`}
                      onClick={(e) => {
                        const submit = e.currentTarget.parentNode as HTMLDivElement;
                        const select = submit.firstChild as HTMLSelectElement;
                        const collectionID = select.value;
                        const data: FeedForAdd = {
                          title: feedTitle,
                          siteUrl: feed.siteUrl,
                          feedUrl: feed.feedUrl,
                          collectionID,
                        };
                        addToState('feeds', select.value, data);
                        setIsFeedSubmitDone(true);
                      }}
                    >
                      <Fa icon={isFeedSubmitDone ? faCheck : faPlus} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="no-feed">
                  <span>{t('popup-no_feed')}</span>
                </div>
              )}
            </div>
          ) : containFeeds ? (
            <div className="contain-feed">
              <span>{t('popup-contain_feed')}</span>
            </div>
          ) : requestError ? (
            <div className="request-error">
              <span>{t('popup-request_error')}</span>
            </div>
          ) : (
            <div className="search-feed">
              <div className="progress-wrap">
                <span>{t('popup-feed_progress')}</span>
                <div className="progress" style={{ width: `${urlCheckProgress}%` }}></div>
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};

export default hot(module)(Popup);
