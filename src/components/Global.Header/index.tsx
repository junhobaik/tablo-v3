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
          window.open('options.html', '_blank');
        }}
        role="link"
      >
        <Fa icon={faCog} />
      </button>
    </div>
  );
};

export default Header;
