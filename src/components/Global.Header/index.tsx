import React from "react";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

import "./index.scss";

const Header = () => {
  return (
    <div id="Header">
      <h1>Tablo</h1>
      <button
        onClick={() => {
          chrome.storage.sync.clear();
          localStorage.clear();
        }}
      >
        <Fa icon={faCog} />
      </button>
    </div>
  );
};

export default Header;
