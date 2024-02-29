import React, { Component } from 'react';
import plus from "./img/plus.png";
import spy from "./img/spyglass.png";
import "./styles/bar.css";

var current = 0;

function keyPress(e) {
    e.preventDefault();
    if(e.key == "!") {
        console.log("Ingredients");
        document.getElementById("bar").setAttribute("state", "ing");
        document.getElementById("switch").setAttribute("state", "ing");
        document.getElementById("bar").style.border = "2px solid #34252F";
        document.getElementById("search-button").style.backgroundColor = "#34252F";
        document.getElementById("search-button").style.width = "45px";
        document.getElementById("add-button").style.backgroundColor = "#34252F";
        document.getElementById("add-button").style.right = "55px";
        document.getElementById("spy").style.marginLeft = "12.5px";
        //Switch
        document.getElementById("ball").style.right = "calc(8em - 23.5px)";
        document.getElementById("rec_tag").style.left = "-8em";
        document.getElementById("ing_tag").style.left = "0em";
        
    } else if(e.key == "@") {
        console.log("Recipe");
        document.getElementById("bar").setAttribute("state", "rec");
        document.getElementById("switch").setAttribute("state", "ing");
        document.getElementById("bar").style.border = "2px solid #095c3c";
        document.getElementById("search-button").style.backgroundColor = "#095c3c";
        document.getElementById("search-button").style.width = "100px";
        document.getElementById("add-button").style.backgroundColor = "#095c3c";
        document.getElementById("add-button").style.right = "10px";
        document.getElementById("spy").style.marginLeft = "40px";
        //Switch
        document.getElementById("ball").style.right = "2.5px";
        document.getElementById("rec_tag").style.left = "0em";
        document.getElementById("ing_tag").style.left = "8em";
    } else if(e.key == "+") {
        var item = document.createElement("DIV");
        item.setAttribute("class", "item");
        item.setAttribute("cur", current);
        current++;
        item.innerText = document.getElementById("search-bar").value;
        document.getElementById("search-bar").value = "";
        var close = document.createElement("DIV");
        close.setAttribute("class", "delete");
        
        close.addEventListener("click", (e)=>{
            console.log(e.target.offsetParent.getAttribute("cur"));
        });
        item.appendChild(close);
        var img = document.createElement("IMG");
        close.appendChild(img);
        if(document.getElementById("bar").getAttribute("state") == "ing") {
            item.style.backgroundColor = "#34252F";
        } else {
            item.style.backgroundColor = "#095C3C";
        }
        document.getElementById("search-items").appendChild(item);
    } 
    else {
        if(e.key != "Enter")
            document.getElementById("search-bar").value += e.key;
    }
}

function clickSwitch(e) {
    e.preventDefault();
    var ball = document.getElementById("ball");
    var rTag = document.getElementById("rec_tag");
    var iTag = document.getElementById("ing_tag");

    if(document.getElementById("switch").getAttribute("state") == "rec") {
        rTag.style.left = "-8em";
        iTag.style.left = "0em";
        ball.style.right = "calc(8em - 23.5px)";
        document.getElementById("switch").setAttribute("state", "ing");
        document.getElementById("bar").setAttribute("state", "ing");
        document.getElementById("search-button").style.width = "45px";
        document.getElementById("bar").style.border = "2px solid #34252F";
        document.getElementById("search-button").style.backgroundColor = "#34252F";
        document.getElementById("add-button").style.backgroundColor = "#34252F";
        document.getElementById("add-button").style.right = "55px";
        document.getElementById("spy").style.marginLeft = "12.5px";
    } else {
        rTag.style.left = "0em";
        iTag.style.left = "8em";
        ball.style.right = "2.5px";
        document.getElementById("switch").setAttribute("state", "rec");
        document.getElementById("bar").setAttribute("state", "rec");
        document.getElementById("search-button").style.width = "100px";
        document.getElementById("bar").style.border = "2px solid #095c3c";
        document.getElementById("search-button").style.backgroundColor = "#095c3c";
        document.getElementById("add-button").style.backgroundColor = "#095c3c";
        document.getElementById("add-button").style.right = "10px";
        document.getElementById("spy").style.marginLeft = "40px";
    }
}

function addIng() {
    var item = document.createElement("DIV");
    item.setAttribute("class", "item");
    item.innerText = document.getElementById("search-bar").value;
    document.getElementById("search-bar").value = "";
    var close = document.createElement("DIV");
    close.setAttribute("class", "delete");
    item.appendChild(close);
    if(document.getElementById("bar").getAttribute("state") == "ing") {
        item.style.backgroundColor = "#34252F";
    } else {
        item.style.backgroundColor = "#095C3C";
    }
    document.getElementById("search-items").appendChild(item);
}


class Bar extends Component {

    render() {
        return(
            <div>

                <div id="switch" state="rec" onClick={clickSwitch}>

                    <div id="ball"></div>

                    <div id="rec_tag">

                        <h5>Recipes</h5>

                    </div>

                    <div id="ing_tag">

                        <h5>Ingredients</h5>

                    </div>

                </div>

                <div id="bar">

                    <input type="text" name="search_bar" state="ing" id="search-bar" onKeyPress={keyPress}/>

                    <div id="search-button">

                        <img src={spy} id="spy"/>

                    </div>

                    <div id="add-button" onClick={addIng}>

                        <img src={plus} id="plus"/>

                    </div>

                </div>

                <div id="search-items">



                </div>

            </div>
        );
    } 

}

export default Bar