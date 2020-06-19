import * as React from 'react';
import { useEffect, useState } from 'react';

import './index.scss';
import { RootState } from '../../modules';
import { LinkMethod, ReloadPostsHour, HidePostsDay } from '../../modules/global/actions';
import { LocalData } from '../Content.Feeds';
import utils from '../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const Setting = () => {
  const [state, setState] = useState<RootState>();
  const [firstLoad, setFirstLoad] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>('light');

  useEffect(() => {
    chrome.storage.sync.get('tablo3', (res) => {
      if (res.tablo3) {
        setState(res.tablo3);
        setFirstLoad(true);
      }
    });

    setTheme(utils.getLoaclStorage('tablo3_theme') ?? 'light');
  }, []);

  useEffect(() => {
    if (firstLoad) {
      chrome.storage.sync.set(
        {
          tablo3: state,
        },
        () => {
          utils.setLocalStorage('tablo3_changed', 'true');
        }
      );
    }
  }, [firstLoad, state]);

  if (!state) {
    return <div>loading...</div>;
  } else {
    const { global } = state;
    const { linkMethod, reloadPosts, hidePosts } = global;

    const setThemeAndLocal = (themeName: 'light' | 'dark') => {
      const { setLocalStorage } = utils;
      setTheme(themeName);
      setLocalStorage('tablo3_theme', themeName);
      setLocalStorage('tablo3_changed', 'true');
    };

    const setStateHidePosts = (day: HidePostsDay) => {
      setState({
        ...state,
        global: {
          ...state.global,
          hidePosts: day,
        },
      });
    };

    const setStateReloadPosts = (hour: ReloadPostsHour) => {
      setState({
        ...state,
        global: {
          ...state.global,
          reloadPosts: hour,
        },
      });
    };

    const setStateLinkMethod = (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.currentTarget.value.split('.');
      console.log(v);

      setState({
        ...state,
        global: {
          ...state.global,
          linkMethod: {
            ...state.global.linkMethod,
            [v[0]]: v[1],
          },
        },
      });
    };

    const createRadioButton = (type: 'tab' | 'collection' | 'post' | 'feed', method: LinkMethod, labelText: string) => {
      return (
        <div className="radio-wrap">
          <input
            type="radio"
            name={`${type}-radio`}
            id={`${type}-${method}`}
            value={`${type}.${method}`}
            checked={linkMethod[type] === method}
            onChange={(e) => {
              setStateLinkMethod(e);
            }}
          />
          <label htmlFor={`${type}-${method}`}>{labelText}</label>
        </div>
      );
    };

    return (
      <div id="Setting">
        <div className="theme">
          <h2>Theme</h2>
          <div className="color">
            <div
              className="light"
              onClick={() => {
                setThemeAndLocal('light');
              }}
            >
              <div className="inner">{theme === 'light' ? <FontAwesomeIcon icon={faCheck} /> : null}</div>
            </div>
            <div
              className="dark"
              onClick={() => {
                setThemeAndLocal('dark');
              }}
            >
              <div className="inner">{theme === 'dark' ? <FontAwesomeIcon icon={faCheck} /> : null}</div>
            </div>
          </div>
        </div>

        <div className="open-link">
          <h2>How to Open Link</h2>
          <div className="open-link-inner-wrap">
            <div className="tabs">
              <h3>Tabs</h3>
              <div className="tabs-inner-wrap">
                <h4>Link</h4>
                <div className="tabs-link">
                  {createRadioButton('tab', 'new', 'New tab')}
                  {createRadioButton('tab', 'current', 'Current Tab')}
                </div>
                <h4>Collection</h4>
                <div className="tabs-window">
                  {createRadioButton('collection', 'new', 'New Window')}
                  {createRadioButton('collection', 'current', 'Current Window')}
                </div>
              </div>
            </div>

            <div className="feeds">
              <h3>Feeds</h3>
              <div className="feeds-inner-wrap">
                <h4>Post</h4>
                <div className="feeds-post">
                  {createRadioButton('post', 'new', 'New tab')}
                  {createRadioButton('post', 'current', 'Current tab')}
                </div>
                <h4>Feed</h4>
                <div className="feeds-feed">
                  {createRadioButton('feed', 'new', 'New tab')}
                  {createRadioButton('feed', 'current', 'Current tab')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="posts">
          <h2>Posts</h2>

          <div className="posts-inner-wrap">
            <div className="hide-post">
              <h3>Hide old posts</h3>
              <select
                onChange={(e) => {
                  setStateHidePosts(Number(e.currentTarget.value) as HidePostsDay);
                }}
                defaultValue={hidePosts}
              >
                <option value="0">No Hide</option>
                <option value="7">7D</option>
                <option value="14">14D</option>
                <option value="30">30D</option>
                <option value="60">60D</option>
                <option value="90">90D</option>
              </select>
            </div>

            <div className="reload-post">
              <h3> Reload cycle of feed posts</h3>
              <select
                onChange={(e) => {
                  setStateReloadPosts(Number(e.currentTarget.value) as ReloadPostsHour);
                }}
                defaultValue={reloadPosts}
              >
                {process.env.NODE_ENV === 'development' ? <option value="0">0</option> : null}
                <option value="3">3H</option>
                <option value="6">6H</option>
                <option value="9">9H</option>
                <option value="12">12H</option>
                <option value="24">24H</option>
              </select>
              <button
                className="force-reload"
                onClick={() => {
                  const local = utils.getLoaclStorage('tablo3_local');
                  const originLocalData: LocalData = local ? JSON.parse(local) : { items: [], lastLoadDate: 0 };

                  const localData: LocalData = {
                    ...originLocalData,
                    lastLoadDate: '0',
                  };

                  utils.setLocalStorage('tablo3_local', localData);
                  location.reload();
                }}
              >
                Force Reload
              </button>
            </div>
          </div>
        </div>

        <div className="last">
          <span>변경 사항은 최대 5초 후 적용됩니다.</span>
        </div>
      </div>
    );
  }
};
export default Setting;
