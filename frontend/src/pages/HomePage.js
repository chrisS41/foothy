import React, { useState, useEffect } from 'react'
import { Button } from '../components/Button';
import { RecipePopup } from '../components/RecipePopup';
import { FaIgloo, FaPencilAlt } from 'react-icons/fa'
import SearchBar from '../../src/components/SearchBar/SearchBar';
import { allowedNodeEnvironmentFlags } from 'process';
import axios from "axios";

function HomePage() {
    const [popupOpen, setPopupOpen] = useState(false);
    const togglePopup = () => setPopupOpen(!popupOpen);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(async () => {
      try {
        if(window.sessionStorage.getItem("islogin")) {
          setIsLoggedIn(true)
        }
        /*await fetch('/getUserInfo')
          .then(res => {
            if (res.status === 200) {
              res.json().then(result => {
                //alert(result.islogin);
                setIsLoggedIn(result.islogin);
              })
            }
          })*/
      } catch (e) {
        alert("welcomePage "+e);
      }
    }, []);

    const renderAddButton = () => {
    //const isLoggedIn = window.sessionStorage.getItem('islogin');
    //var isLoggedIn = 'true'; //-Just for testing, cause I'm lazy
    return isLoggedIn === true ? 
      <div class="add-recipe-button-container">
        <Button 
        filled
        label="Add Recipe"
        icon={FaPencilAlt}
        onClick={togglePopup}/>
      </div> : 
      '';
    }

    const addAxios = () => {
      axios.post("config.BE.Addr/testing", 
      JSON.stringify({"boobs": "ass"}), 
      {headers: { 'Content-Type': 'application/json' }}
      ).then(res=>{
        console.log(res.data)
      });
    }

    return (
        <div className="homepage-container">
          {/* <button onClick={addAxios}>shit</button> */}
        <SearchBar page="homePage"/>
        {renderAddButton()}
        { popupOpen ? <RecipePopup onClose={togglePopup}/> : ''}
        </div>
    )
}

export default HomePage
