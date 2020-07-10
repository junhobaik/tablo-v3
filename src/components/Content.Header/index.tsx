import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { actionCreators, WindowItem } from '../../modules/global/actions';
import { RootState } from '../../modules';
import './index.scss';

type Content = 'tabs' | 'feeds';

interface ContentHeaderProps {
  content: Content;
  searchFunc: Function;
  reverse: boolean;
  loadProgress?: number;
  isOffline?: boolean;
}

const ContentHeader = (props: ContentHeaderProps) => {
  const [t] = useTranslation();
  const { content, reverse, isOffline } = props;
  const dispatch = useDispatch();
  const windowStatus = useSelector((state: RootState) => state.global.window);
  const contentUpperCaseName = content.charAt(0).toUpperCase() + content.slice(1);

  const openSetting = () => {
    if (windowStatus === 'default') {
      const windowName = `${content}-setting` as WindowItem;
      dispatch(actionCreators.setWindow(windowName));
    } else {
      dispatch(actionCreators.setWindow('default'));
    }
  };

  return (
    <div className={`${content}-header content-header ${reverse ? 'reverse' : ''}`}>
      <div className="content-header-inner-wrap">
        {/* <div className="content-search">
          <button
            className="search-active-btn"
            onClick={(e) => {
              const contentSearch = e.currentTarget
                .parentNode as HTMLDivElement;

              if (contentSearch.classList.contains("active")) {
                contentSearch.classList.remove("active");
              } else {
                contentSearch.classList.add("active");
                const searchInput = contentSearch.lastChild as HTMLInputElement;
                searchInput.focus();
              }
            }}
          >
            <Fa icon={faSearch} />
          </button>
          <input
            className={`search-input ${content}-search-input`}
            type="text"
            onChange={() => {
              //
            }}
          />
        </div> */}
        <div className="status">
          {content === 'feeds' && isOffline ? (
            <p className="offline-msg">{t('offline')}</p>
          ) : content === 'feeds' && props.loadProgress && props.loadProgress <= 100 ? (
            <div className="load-progress">
              <div className="progress" style={{ width: `${props.loadProgress}%` }}></div>
            </div>
          ) : null}
        </div>
      </div>
      <button onClick={openSetting}>
        {windowStatus === 'default' ? (
          <>
            <span>{`${contentUpperCaseName} Menu`}</span>
            <Fa icon={faAngleRight} />
          </>
        ) : (
          <>
            <span>{`${contentUpperCaseName} Menu`}</span>
            <Fa icon={faAngleLeft} />
          </>
        )}
      </button>
    </div>
  );
};

export default ContentHeader;
