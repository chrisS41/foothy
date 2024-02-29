import React, { useState } from 'react';
import { Blocker } from './Blocker';
import * as FaIcons from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { ReportPostForm } from './ReportPostForm';
import { Button } from './Button';
import './styles/Popup.css';

export const ReportPostPopup = ({ onClose }) => {
  const [isButtonEnabled, toggleButtonEnabled] = useState(false);

  const toggleButton = (buttonEnabled) => {
    toggleButtonEnabled(buttonEnabled);
  }

  return(
    <div className="popup">
    <div className="popup-container report-post-popup">
      <div className="popup-content">
      <div className="popup-header">
        <IconContext.Provider value={{color: '#000000'}}> 
          <button className="close-button" onClick={onClose}>
            <FaIcons.FaTimes className="close-icon"/>
          </button>
        </IconContext.Provider>
        </div>
        <ReportPostForm onValidate={toggleButton}/>
      </div>
      <div className="action-bar">
        <div className="cancel-button-container"><Button secondary label="Cancel" onClick={onClose}/></div>
        <div className="action-button-container"><Button filled label="Report" disabled={!isButtonEnabled}/></div>
      </div>
    </div>
    <Blocker onClick={onClose}/>
  </div>
  )
}