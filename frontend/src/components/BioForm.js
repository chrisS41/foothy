import React, {Component} from 'react';
import {useState} from 'react';
import './styles/BioForm.css'

export const BioForm = ({show, close, bio, setBio}) =>{

    const [buffer, setBuffer] = useState(bio);

    const handleSubmit = (event) => {
        event.preventDefault();
    }

    const handleClick = () => {
        close();
        setBio(buffer);
    }

    return (
        <div className="formContainer" style={{opacity: show? '1' : '0' , zIndex: show? 1000: 0}} >
            {show? <div className="formWrapper">
                <div className="headerSection">
                    <h3>Edit Bio</h3>
                    <span onClick={close} className="closeButton">x</span>
                </div>

                <form  className="formContent" onSubmit={handleSubmit}>
                    <textarea maxlength="100" rows="5" cols="45" className="formText" type="text" value={buffer} onChange={(e)=> setBuffer(e.target.value)}/>
                    <input className="formSubmit" type="submit" value="Save Changes" onClick={handleClick}/>
                </form>

            </div> : null}
        </div>
    )
};