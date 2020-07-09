import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hot } from 'react-hot-loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import { RootState } from '../modules';
import { actionCreators as tabsActionCreators } from '../modules/tabs/actions';
import { actionCreators as globalActionCreators } from '../modules/global/actions';
import { actionCreators as feedsActionCreators } from '../modules/feeds/actions';

import Tabs from './Content.Tabs';
import Feeds from './Content.Feeds';
import Header from './Global.Header';
import TabsSetting from './Menu.TabsSetting';
import FeedsSetting from './Menu.FeedsSetting';
import Modal from './utils/Modal';
import Setting from './Global.Setting';
import BoundaryError from './BoundaryError';

import './app.scss';
import '../styles/content.scss';
import utils from './utils';

const App = (props: { store: any }) => {
  const { store } = props;
  const dispatch = useDispatch();
  const [isLoadedState, setIsLoadedState] = useState(false);
  const [isSettingModal, setIsSettingModal] = useState(false);
  const [theme, setTheme] = useState<string>();
  const windowStatus = useSelector((state: RootState) => state.global.window);
  const [isStorageError, setIsStorageError] = useState(false);
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
      if (!isLoadedState) setIsLoadedState(true);
    });
  };

  useEffect(() => {
    let unsubscribe: Function | undefined;
    let onChangeEvent: any | undefined;

    if (isLoadedState) {
      // eslint-disable-next-line no-unused-vars
      onChangeEvent = (storage: any) => {
        console.log('chrome.storage.onChanged');

        const { oldValue, newValue } = storage.tablo3;
        if (oldValue !== newValue) {
          console.log('old !== new');
          loadAndSetStates();
        }
      };

      unsubscribe = store.subscribe(() => {
        console.log('store.subscribe()');
        const state = store.getState();

        chrome.storage.sync.get('tablo3', (storage) => {
          let oldData: RootState | undefined | null;
          if (storage.tablo3) oldData = storage.tablo3;

          chrome.storage.sync.set(
            {
              tablo3: { ...state, global: { ...state.global, drag: null, drop: null } },
            },
            () => {
              if (chrome.runtime.lastError) {
                const error = chrome.runtime.lastError.message as string;

                if (error.includes('QUOTA_BYTES_PER_ITEM')) {
                  console.log('ERROR: QUOTA_BYTES_PER_ITEM');
                  setIsStorageError(true);

                  if (oldData) {
                    chrome.storage.sync.set(
                      {
                        tablo3: oldData,
                      },
                      () => {
                        loadAndSetStates();
                      }
                    );
                  }
                }
              }
            }
          );
        });
      });

      chrome.storage.onChanged.addListener(onChangeEvent);
    }
    return () => {
      if (unsubscribe) unsubscribe();
      if (onChangeEvent) chrome.storage.onChanged.removeListener(onChangeEvent);
    };
  }, [isLoadedState]);

  useEffect(() => {
    loadAndSetStates();
    return () => {};
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

          {isStorageError ? (
            <Modal title="Error" toggleVisibility={setIsStorageError}>
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <div>
                  <FontAwesomeIcon icon={faExclamationTriangle} style={{ fontSize: '4rem', marginBottom: '1rem' }} />
                  <p>저장할 수 있는 용량을 초과하였습니다.</p>
                  <p>오류가 계속될 경우 기존 데이터 일부 삭제로 용량을 확보하세요.</p>
                </div>
              </div>
            </Modal>
          ) : null}
        </div>
      </div>
    </BoundaryError>
  );
};

export default hot(module)(App);
