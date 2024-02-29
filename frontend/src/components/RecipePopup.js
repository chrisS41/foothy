import React, { useState } from 'react';
import { Blocker } from './Blocker';
import { RecipeForm, data } from './RecipeForm';
import * as FaIcons from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { Button } from './Button';
import './styles/Popup.css';
import axios from "axios";

export const RecipePopup = ({ onClose }) => {
  const [isButtonEnabled, toggleButtonEnabled] = useState(false);
  const [resetForm, resetHandler] = useState(0);

  const toggleButton = (buttonEnabled) => {
    toggleButtonEnabled(buttonEnabled);
  }

  const connToBE= () => {
    //This is async I believe
    axios.post("https://currserver.herokuapp.com/xhr", 
    JSON.stringify(data["info"]), 
    {headers: { 'Content-Type': 'application/json' }}
    ).then(res=>{
      //document.getElementById("imgDis").innerHTML = "";
      if(res.data == "finish") {
        axios.post("https://currserver.herokuapp.com/xhr", 
        JSON.stringify(data["imgs"]),
        {headers: {'Content-Type': "application/json"}}
        ).then(res=>{
          console.log(res);
          //We'll just remove all the content here
          toggleButton(false);
          resetHandler(1)
          resetHandler(0)
        });
      }
    });
  }

  //disabled={!isButtonEnabled}

  return(
    <div className="popup">
      <div className="popup-container create-recipe-popup">
        <div className="popup-content">
        <div className="popup-header">
          <IconContext.Provider value={{color: '#000000'}}> 
            <button className="close-button" onClick={onClose}>
              <FaIcons.FaTimes className="close-icon"/>
            </button>
          </IconContext.Provider>
          </div>
          <RecipeForm onValidate={toggleButton} reset={resetForm}/>
        </div>
        <div className="action-bar">
          <div className="cancel-button-container"><Button secondary label="Cancel" onClick={onClose}/></div>
          <div className="action-button-container"><Button filled disabled={!isButtonEnabled} label="Post" onClick={connToBE}/></div>
        </div>
      </div>
      <Blocker onClick={onClose}/> {/* uses blocker to avoid UI bugs when opening menus or popups*/}
    </div>
  )
}