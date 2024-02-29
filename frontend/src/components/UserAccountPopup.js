import React from 'react';
import { Blocker } from './Blocker';
import { UserAccountForm } from './UserAccountForm';
import * as FaIcons from 'react-icons/fa';
import { IconContext } from 'react-icons';
import './styles/Popup.css';

export const UserAccountPopup = ({ onClose, onSignIn }) => {
  return(
    <div className="popup">
      <div className="popup-container popup-content user-account-popup">
      <div className="popup-header">
        <IconContext.Provider value={{color: '#000000'}}> 
          <button className="close-button" onClick={onClose}>
            <FaIcons.FaTimes className="close-icon"/>
          </button>
        </IconContext.Provider>
        </div>
        <UserAccountForm onSignIn={onSignIn} onClose={onClose}/></div>
      <Blocker onClick={onClose}/> {/* uses blocker to avoid UI bugs when opening menus or popups*/}
    </div>
  )
}