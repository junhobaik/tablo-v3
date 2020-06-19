/* eslint no-unused-vars: 0 */

import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';
import { faTimes, faPen, faPlusCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

import { actionCreators as feedsActionCreators, Feed } from '../../../modules/feeds/actions';
import { actionCreators as globalActionCreators, DragMoveData, DropData } from '../../../modules/global/actions';
import { RootState } from '../../../modules';

const FeedItem = ({
  feedList,
  collectionId,
  collectionVisibility,
  toggleVisiblity,
  disableEditFromKey,
  drag,
  drop,
  editTarget,
  setEditTarget,
}: {
  feedList: Feed[];
  collectionId: string;
  collectionVisibility: boolean;
  toggleVisiblity: Function;
  disableEditFromKey: Function;
  drag: DragMoveData | null;
  drop: DropData | null;
  editTarget: string;
  setEditTarget: Function;
}) => {
  const dispatch = useDispatch();
  const linkMethod = useSelector((state: RootState) => state.global.linkMethod);
  const feedLinkMethod = linkMethod.feed === 'new' ? '_blank' : '_self';

  // >feed
  const addPinEl = (
    <div className="add-pin">
      <Fa icon={faPlusCircle} />
      <div className="line"></div>
    </div>
  );

  const mapFeedList = feedList.map((f, i) => {
    const { id, title, visibility, siteUrl, feedUrl, faildCount } = f;
    const isErrorFeed = faildCount >= 1;

    const setBtnsShow = (feedItemEl: HTMLLIElement, isShow: boolean, immediately: boolean = false) => {
      const btnsWrap = feedItemEl.querySelector('.btns-wrap') as HTMLDivElement;

      if (immediately) {
        btnsWrap.classList.remove('is-transition');
      } else {
        btnsWrap.classList.add('is-transition');
      }

      if (isShow) {
        btnsWrap.classList.add('show');
      } else {
        btnsWrap.classList.remove('show');
      }
    };

    const toggleAddPin = (e: React.DragEvent<HTMLElement>, isShow: boolean) => {
      const parent = e.currentTarget.parentNode as HTMLDivElement;
      const addPin = parent.querySelector('.add-pin') as HTMLDivElement;
      addPin.style.opacity = isShow ? '1' : '0';
    };

    const toggleDropSpaces = (e: React.DragEvent<HTMLElement>, isShow: boolean) => {
      const feedWrapEl = e.currentTarget.parentNode as HTMLDivElement;
      const feedCollectionContent = feedWrapEl.parentNode as HTMLOListElement;
      const feedCollection = feedCollectionContent.parentNode as HTMLLIElement;
      const feedCollectionList = feedCollection.parentNode as HTMLOListElement;

      const currentCollectionDropSapces = feedCollectionContent.querySelectorAll('.drop-space') as NodeListOf<
        HTMLDivElement
      >;

      const currentDropSpace: HTMLDivElement = currentCollectionDropSapces[i];
      const nextDropSpaces = currentCollectionDropSapces[i + 1] as HTMLDivElement | undefined;

      const dropSpaces = Array.from(feedCollectionList.querySelectorAll('.drop-space')) as HTMLDivElement[];

      const filteredDropSapces = _.filter(dropSpaces, (d) => {
        if (d !== currentDropSpace && d !== nextDropSpaces) return true;
        return false;
      });

      if (isShow) {
        for (const d of filteredDropSapces) {
          d.style.display = 'flex';
        }
      } else {
        for (const d of dropSpaces) {
          d.style.display = 'none';
        }
      }
    };

    return (
      <div
        className="feed-wrap"
        key={`feed-${id}`}
        onDragEnter={(e) => {
          e.stopPropagation();
        }}
        onDragLeave={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          className="drop-space"
          onDragEnter={(e) => {
            if (drag && drag.type === 'feeds-setting-feed') {
              dispatch(
                globalActionCreators.setDropData({
                  collection: collectionId,
                  index: i,
                })
              );
              toggleAddPin(e, true);
            }
          }}
          onDragLeave={(e) => {
            toggleAddPin(e, false);
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            console.log(drag, drop);
            toggleAddPin(e, false);

            const dragData = drag as DragMoveData | null;

            if (drop && dragData?.type === 'feeds-setting-feed') {
              dispatch(feedsActionCreators.moveFeedItem(drop.collection, dragData.id, drop.index));
            }
          }}
        ></div>
        {addPinEl}
        <li
          draggable
          key={id}
          className={`feed-item${collectionVisibility ? '' : ' collection-visibility-hide'}${
            isErrorFeed ? ' over-failed' : ''
          }`}
          onMouseEnter={(e) => {
            e.isPropagationStopped();
            setBtnsShow(e.currentTarget, true);
          }}
          onMouseLeave={(e) => {
            e.isPropagationStopped();
            setBtnsShow(e.currentTarget, false);
          }}
          onMouseDown={(e) => {
            setBtnsShow(e.currentTarget, false, true);
          }}
          onClick={() => {
            if (isErrorFeed) {
              window.open(feedUrl, feedLinkMethod);
            } else {
              window.open(siteUrl, feedLinkMethod);
            }
          }}
          onDragStart={(e) => {
            dispatch(
              globalActionCreators.setDragData({
                type: 'feeds-setting-feed',
                id,
              })
            );

            toggleDropSpaces(e, true);
          }}
          onDragEnd={(e) => {
            dispatch(globalActionCreators.clearDragData());
            dispatch(globalActionCreators.clearDropData());

            toggleDropSpaces(e, false);
          }}
          role="link"
        >
          {isErrorFeed ? (
            <div className="error-feed-icon-wrap">
              <Fa icon={faExclamationCircle} />
            </div>
          ) : (
            <button
              className={`toggle-visiblility-btn ${collectionVisibility ? '' : 'collection-visibility-hide'}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleVisiblity(id, 'feed');
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
            >
              <div className={`inner ${visibility ? 'vislble' : 'hidden'}`}></div>
            </button>
          )}

          {editTarget === id ? (
            <div className="title-input-wrap">
              <input
                type="text"
                className="title-input"
                placeholder={title}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onKeyDown={(e) => disableEditFromKey(e)}
                onChange={(e) => {
                  dispatch(feedsActionCreators.editFeedTitle(id, e.currentTarget.value));
                }}
              />
            </div>
          ) : (
            <h3 className="title-text">{title}</h3>
          )}

          <div
            className="btns-wrap"
            onClick={(e) => {
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
          >
            <button
              className="edit-btn"
              onClick={() => {
                setEditTarget(id);
              }}
            >
              <Fa icon={faPen} />
            </button>
            <button
              className="delete-btn"
              onClick={() => {
                dispatch(feedsActionCreators.deleteFeed(id));
                dispatch(feedsActionCreators.setIsChanged(true));
              }}
            >
              <Fa icon={faTimes} />
            </button>
          </div>
        </li>
      </div>
    );
  });

  const lastAddPinEl = (
    <div className="feed-wrap last-add-pin-wrap" key={`last-add-pin`}>
      {addPinEl}
    </div>
  );
  mapFeedList.push(lastAddPinEl);

  return <>{mapFeedList}</>;
};

export default FeedItem;
