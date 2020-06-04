import * as React from "react";

import "./index.scss";

const Setting = () => {
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
              <div className="radio-wrap">
                <input type="radio" name="tabs-link" id="tabsLink1" />
                <label htmlFor="tabsLink1">New tab</label>
              </div>
              <div className="radio-wrap">
                <input type="radio" name="tabs-link" id="tabsLink1" />
                <label htmlFor="tabsLink2">Current tab</label>
              </div>
            </div>
            <h4>Links in Collection</h4>
            <div className="tabs-window">
              <div className="radio-wrap">
                <input type="radio" name="tabs-window" id="tabsWindow1" />
                <label htmlFor="tabsWindow1">New window</label>
              </div>
              <div className="radio-wrap">
                <input type="radio" name="tabs-window" id="tabsWindow2" />
                <label htmlFor="tabsWindow2">Current window</label>
              </div>
            </div>
          </div>
        </div>

        <div className="feeds">
          <h3>Feeds</h3>
          <div className="feeds-inner-wrap">
            <h4>Post</h4>
            <div className="radio-wrap">
              <input type="radio" name="feed-post" id="feedPost1" />
              <label htmlFor="feedPost1">New tab</label>
            </div>
            <div className="radio-wrap">
              <input type="radio" name="feed-post" id="feedPost2" />
              <label htmlFor="feedPost2">Current tab</label>
            </div>
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
};

export default Setting;
