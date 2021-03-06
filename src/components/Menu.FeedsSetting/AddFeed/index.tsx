/* eslint no-unused-vars: 0 */
/* eslint @typescript-eslint/no-unused-vars: 0 */
// useDispatch
/* eslint no-sparse-arrays: 0 */
// ?

import * as React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';
import {
  faExclamationCircle,
  faInfoCircle,
  faTimesCircle,
  faCheckCircle,
  faAngleDown,
  faAngleUp,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { actionCreators as feedsActionCreators, FeedForAdd, FeedsState } from '../../../modules/feeds/actions';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

type MessageType = 'warn' | 'error' | 'info' | 'success';

interface Message {
  type: MessageType;
  msg: string;
}

const AddFeed = ({ feedsState }: { feedsState: FeedsState }) => {
  const [t] = useTranslation();
  const messages = {
    first: t('add_feed-first'),
    info: t('add_feed-info'),
    http: t('add_feed-http'),
    slash: t('add_feed-slash'),
    error: t('add_feed-error'),
    success: t('add_feed-success'),
    already: t('add_feed-already'),
  };

  const dispatch = useDispatch();
  const [addUrlValue, setAddUrlValue] = useState<string>('');
  const [addTitleValue, setTitleValue] = useState<string>('');
  const [validationData, setValidationData] = useState<FeedForAdd | null>(null);
  const [message, setMessage] = useState<Message>({
    type: 'info',
    msg: messages.first,
  });
  const { feeds, collections, foldAddFeed } = feedsState;

  const addFeedReset = () => {
    setAddUrlValue('');
    setTitleValue('');
    setValidationData(null);
  };

  async function feedUrlValidation(requestUrl: string) {
    try {
      const fetchURL = `https://api.rss2json.com/v1/api.json?rss_url=${requestUrl}`;
      const response = await fetch(fetchURL);
      const feedData = await response.json();

      if (response.ok) {
        if (_.find(feeds, ['feedUrl', feedData.feed.url])) {
          setMessage({
            type: 'error',
            msg: messages.already,
          });
        } else {
          setValidationData({
            title: feedData.feed.title ?? 'Untitled',
            siteUrl: feedData.feed.link,
            feedUrl: feedData.feed.url,
            collectionID: null,
          });
          setMessage({
            type: 'success',
            msg: messages.success,
          });
        }
      } else {
        setMessage({
          type: 'error',
          msg: messages.error,
        });
      }
    } catch {
      // console.log(err);
    }
  }

  const addUrlOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    if (value.length > 8) {
      const isHttp = value.indexOf('http://') > -1;
      const isHttps = value.indexOf('https://') > -1;

      if (isHttp || isHttps) {
        // http 검사 통과
        const slashCnt = (value.match(/\//g) ?? []).length;

        if (slashCnt === 3) {
          // 슬래시 개수 3개, feed url 검사 시작
          setAddUrlValue(value);
          setMessage({
            type: 'info',
            msg: messages.info,
          });
        } else if (slashCnt > 3) {
          // 슬래시 개수 초과
          setMessage({
            type: 'warn',
            msg: messages.slash,
          });
        } else {
          setAddUrlValue(value);
        }
      } else {
        // http 검사 불통
        setMessage({
          type: 'warn',
          msg: messages.http,
        });
      }
    } else {
      setAddUrlValue(value);
      setMessage({
        type: 'info',
        msg: messages.info,
      });
    }
  };

  const mapCollectionsForSelect = collections.map((c) => {
    return (
      <option key={`option-${c.id}`} value={c.id}>
        {c.title}
      </option>
    );
  });

  return (
    <div className="add-feed">
      <div className={`add-feed-header`}>
        <button
          onClick={() => {
            dispatch(feedsActionCreators.toggeleAddFeed(!foldAddFeed));
          }}
        >
          <Fa icon={foldAddFeed ? faAngleUp : faAngleDown} />
        </button>
        <h2>Add Feed</h2>
      </div>

      {foldAddFeed ? (
        <div className="add-feed-content">
          <div className="add-feed-form">
            <div className={`add-feed-url-check ${validationData ? 'validation' : 'invalidation'}`}>
              <div className="url-input-wrap">
                <input
                  className="url-input"
                  type="text"
                  placeholder="URL..."
                  value={addUrlValue}
                  disabled={validationData ? true : false}
                  onChange={addUrlOnChange}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) (document.querySelector('.url-check-btn') as HTMLButtonElement).click();
                  }}
                />
                {message.type === 'success' && validationData ? (
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
                      type: 'info',
                      msg: messages.first,
                    });
                    setAddUrlValue('');
                  }
                }}
              >
                {validationData ? <Fa icon={faTimes} /> : 'URL Check'}
              </button>
            </div>

            {message.type === 'success' && validationData ? (
              <div className="add-feed-info">
                <div className="add-feed-info-inputs-wrap">
                  <div className="title-info">
                    <h3>Title</h3>
                    <input
                      type="text"
                      placeholder={validationData ? validationData.title : 'TITLE...'}
                      value={addTitleValue}
                      onChange={(e) => {
                        setTitleValue(e.currentTarget.value);
                      }}
                      onFocus={(e) => {
                        if (validationData) setTitleValue(validationData.title);
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
                      const selectEl = document.getElementById('addFeedSelect') as HTMLSelectElement;
                      const title = addTitleValue ? addTitleValue : validationData?.title ?? 'Untitled';

                      if (validationData) {
                        dispatch(
                          feedsActionCreators.addFeed({
                            title: title,
                            siteUrl: validationData.siteUrl,
                            feedUrl: validationData.feedUrl,
                            collectionID: selectEl.value === 'new' ? null : selectEl.value,
                          })
                        );
                        addFeedReset();
                        setMessage({
                          type: 'info',
                          msg: `"${title}" ${t('add_feed-success-add')}`,
                        });
                      } else {
                        setMessage({
                          type: 'error',
                          msg: t('add-feed-unknown-error'),
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
              {message.type === 'info' ? <Fa icon={faInfoCircle} /> : null}
              {message.type === 'warn' ? <Fa icon={faExclamationCircle} /> : null}
              {message.type === 'error' ? <Fa icon={faTimesCircle} /> : null}
              {message.type === 'success' ? <Fa icon={faCheckCircle} /> : null}
            </div>
            <div className="text-wrap">
              <span className="message">{message.msg}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AddFeed;
