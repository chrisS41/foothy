import React from 'react';
import './styles/Switch.css';
import cx from "classnames";

/*
HOW TO USE COMPONENT: 
<Switch rounded={true} /> | This sets it so the slider is rounded
<Switch rounded={false} /> | This sets it so the slider is square 

isToggle: When the switch has the colored background
onToggle: Whenever you hit the switch 
Default: Is just square 

import {useState} from "react";

*/
const Switch = ({rounded = false, isToggled, onToggle}) => {

    const SliderCX = cx('slider', {
        'rounded': rounded
    })

    return (
    <label className = "switch">
        <input type = "checkbox" checked={isToggled} onChange={onToggle}/>
        <span className = {SliderCX}/>
    </label>
    );
};

// npm install classnames

export default Switch;