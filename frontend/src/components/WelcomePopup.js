import { React, useEffect, useState } from 'react';
import Video from '../pages/img/foothyanimation.mp4';
import * as FaIcons from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { Blocker } from './Blocker';
import axios from "axios";


import { Button } from '../components/Button';
// axios.defaults.withCredentials = true;

export const WelcomePopup = ({ onClose }) => {

  const redirect = path => window.location.replace(path);
  //const getUsername = () => window.sessionStorage.getItem('username');
  const [fName, setFName] = useState('');

  useEffect(async () => {
    try {
      if(window.sessionStorage.getItem("islogin")) {
        setFName(window.sessionStorage.getItem("firstName"));
      }
      /*
      //await axios.get('https://currserver.herokuapp.com/getUserInfo', {
      await axios.get('https://currserver.herokuapp.com/getUserInfo', {
      mode: "cors",
      headers: { 'Content-Type': 'application/json' }})
        .then(res => {
          if (res.status === 200) {
            console.log(res.data.firstName);
            setFName(res.data.firstName);
          }
        })*/
    } catch (e) {
      alert("welcomePage " + e);
    }
  }, []);

  return(
    <div className="popup">
      <div className="popup-content popup-container welcome-popup">
      <div className="popup-header">
        <IconContext.Provider value={{color: '#000000'}}> 
          <button className="close-button" onClick={onClose}>
            <FaIcons.FaTimes className="close-icon"/>
          </button>
        </IconContext.Provider>
        </div>
        <h1 style={{color: '#3d863a'}}>Hi, <strong>{fName}</strong>! Welcome to</h1>
        <div className="animated-logo-container">
          <video title="Foothy with Avocado Logo Animation" width="300px" autoPlay muted loop><source src={`${Video}`} type="video/mp4"/></video>
        </div>
      </div>
      <Blocker onClick={onClose}/>
    </div>
  )
}