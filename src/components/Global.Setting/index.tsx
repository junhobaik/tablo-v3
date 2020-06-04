import * as React from "react";
import { useEffect, useState } from "react";
import "./index.scss";
import { RootState } from "../../modules";
import { LinkMethod } from "../../modules/global/actions";

const Setting = () => {
  const [state, setState] = useState<RootState>();
  const [firstLoad, setFirstLoad] = useState<boolean>(false);

  useEffect(() => {
    chrome.storage.sync.get("tablo3", (res) => {
      if (res.tablo3) {
        setState(res.tablo3);
        setFirstLoad(true);
      }
    });
  }, []);

  useEffect(() => {
    if (firstLoad) {
      chrome.storage.sync.set(
        {
          tablo3: state,
        },
        () => {
          localStorage.setItem('tablo3_changed', 'true');
        }
      );
    }
  }, [firstLoad, state]);

  if (!state) {
    return <div>loading...</div>;
  } else {
    const { global } = state;
    const { linkMethod } = global;

    const setStateLinkMethod = (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.currentTarget.value.split(".");
      console.log(state.global.linkMethod);
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

    const createRadioButton = (
      type: "tab" | "collection" | "post",
      method: LinkMethod,
      labelText: string
    ) => {
      return (
        <div className="radio-wrap">
          <input
            type="radio"
            name={`${type}-radio`}
            id={`${type}-${method}`}
            value={`${type}.${method}`}
            checked={linkMethod[type] === "new"}
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
        <h1>Setting</h1>

        <h2>How to Open Link</h2>
        <div className="open-link">
          <div className="tabs">
            <h3>Tabs</h3>
            <div className="tabs-inner-wrap">
              <h4>Link</h4>
              <div className="tabs-link">
                {createRadioButton("tab", "new", "New tab")}
                {createRadioButton("tab", "current", "Current Tab")}
              </div>
              <h4>Collection</h4>
              <div className="tabs-window">
                {createRadioButton("collection", "new", "New Window")}
                {createRadioButton("collection", "current", "Current Window")}
              </div>
            </div>
          </div>

          <div className="feeds">
            <h3>Feeds</h3>
            <div className="feeds-inner-wrap">
              <h4>Post</h4>
              {createRadioButton("post", "new", "New tab")}
              {createRadioButton("post", "current", "Current tab")}
            </div>
          </div>
        </div>

        <h2>Posts</h2>
        <div className="posts">
          <div className="reload-post">
            <h3> Reload cycle of feed posts</h3>
            <select name="" id="">
              <option value="3">3H</option>
              <option value="6">6H</option>
              <option value="9">9H</option>
              <option value="12">12H</option>
              <option value="24">24H</option>
            </select>
          </div>

          <div className="hide-post">
            <h3>Hide old posts</h3>
            <input type="number" id="hidePostDays" />
            <label htmlFor="hidePostDays">Days</label>
          </div>
        </div>
      </div>
    );
  }
};
export default Setting;
