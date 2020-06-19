import React from 'react';
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

import './index.scss';
import manifest from '../../manifest.json';

const Header = (props: { setIsSettingModal: Function }) => {
  return (
    <div id="Header">
      <div className="title-wrap">
        <h1>Tablo</h1>
        <span>v{manifest.version}</span>
      </div>
      <button
        onClick={() => {
          props.setIsSettingModal(true);
        }}
        role="link"
      >
        <Fa icon={faCog} />
      </button>
    </div>
  );
};

export default Header;
