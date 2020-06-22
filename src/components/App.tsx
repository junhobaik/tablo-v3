import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hot } from 'react-hot-loader';

import { RootState } from '../modules';
import Tabs from './Content.Tabs';
import Feeds from './Content.Feeds';
import Header from './Global.Header';
import TabsSetting from './Menu.TabsSetting';
import FeedsSetting from './Menu.FeedsSetting';
import { actionCreators as tabsActionCreators } from '../modules/tabs/actions';
import { actionCreators as globalActionCreators } from '../modules/global/actions';
import { actionCreators as feedsActionCreators } from '../modules/feeds/actions';

import './app.scss';
import '../styles/content.scss';
import utils from './utils';
import Modal from './utils/Modal';
import Setting from './Global.Setting';
import BoundaryError from './BoundaryError';

const App = (props: { store: any }) => {
  const { store } = props;
  const dispatch = useDispatch();
  const [isLoadedState, setIsLoadedState] = useState(false);
  const [isSettingModal, setIsSettingModal] = useState(false);
  const [theme, setTheme] = useState<string>();
  const windowStatus = useSelector((state: RootState) => state.global.window);
  const state = useSelector((state: RootState) => state); // dev

  const getLocalTheme = () => {
    setTheme(utils.getLoaclStorage('tablo3_theme') ?? 'light');
  };

  const loadAndSetStates = (reloadPosts: boolean = false) => {
    chrome.storage.sync.get('tablo3', (res) => {
      if (res.tablo3) {
        const { tabs, global, feeds } = res.tablo3;
        dispatch(globalActionCreators.resetGlobal(global));
        dispatch(tabsActionCreators.resetTabs(tabs));
        dispatch(feedsActionCreators.resetFeeds(feeds));
        if (reloadPosts) dispatch(feedsActionCreators.setIsChanged(true));
      } else {
        dispatch(feedsActionCreators.setIsChanged(true));
      }

      getLocalTheme();
      setIsLoadedState(true);
    });
  };

  useMemo(() => {
    store.subscribe(() => {
      const state = store.getState();

      chrome.storage.sync.set(
        {
          tablo3: state,
        },
        () => {
          // chrome.storage.sync.getBytesInUse('tablo3', (res) => {
          //   console.log(`${res}byte | ${(res / 102400) * 100}%`);
          // });

          if (chrome.runtime.lastError) {
            const error = chrome.runtime.lastError.message as string;

            if (error.includes('QUOTA_BYTES_PER_ITEM')) {
              console.log('ERROR: QUOTA_BYTES_PER_ITEM');
            }
          }
        }
      );
    });
  }, []);

  // dev
  useEffect(() => {
    const func = (e: KeyboardEvent) => {
      switch (e.keyCode) {
        case 192: // `
          console.log('- state');
          console.log('  - global: ', state.global);
          console.log('  - tabs  : ', state.tabs);
          console.log('  - feeds : ', state.feeds);
          console.log('- localStorage');
          console.log('  - tablo3_changed     : ', JSON.parse(utils.getLoaclStorage('tablo3_changed') ?? 'null'));
          console.log('  - tablo3_reload-posts: ', JSON.parse(utils.getLoaclStorage('tablo3_reload-posts') ?? 'null'));
          console.log('  - tablo3_local       : ', JSON.parse(utils.getLoaclStorage('tablo3_local') ?? 'null'));
          break;

        default:
          break;
      }
    };
    document.addEventListener('keydown', func);

    return () => {
      document.removeEventListener('keydown', func);
    };
  }, [state]);

  useEffect(() => {
    const { getLoaclStorage, setLocalStorage } = utils;

    const detectChange = setInterval(() => {
      const isChanged = JSON.parse(getLoaclStorage('tablo3_changed') ?? 'false');
      const isNeedReloadPosts = JSON.parse(getLoaclStorage('tablo3_reload-posts') ?? 'false');

      if (isChanged) {
        setLocalStorage('tablo3_changed', 'false');
        loadAndSetStates(isNeedReloadPosts);
        if (isNeedReloadPosts) setLocalStorage('tablo3_reload-posts', false);
      }
    }, 5000);

    loadAndSetStates();

    return () => {
      clearInterval(detectChange);
    };
  }, []);

  if (!isLoadedState) {
    return <div></div>;
  }
  return (
    <BoundaryError>
      <div id="theme" className={`theme-${theme}`}>
        <div id="App">
          <Header setIsSettingModal={setIsSettingModal} />

          <div className="app-bottom" style={{ visibility: isLoadedState ? 'visible' : 'hidden' }}>
            <div className="app-bottom-left">{windowStatus === 'feeds-setting' ? <FeedsSetting /> : <Tabs />}</div>
            <div className="app-bottom-right">{windowStatus === 'tabs-setting' ? <TabsSetting /> : <Feeds />}</div>
          </div>

          {isSettingModal ? (
            <Modal title="Settings" toggleVisibility={setIsSettingModal}>
              <Setting />
            </Modal>
          ) : null}
        </div>
      </div>
    </BoundaryError>
  );
};

export default hot(module)(App);
