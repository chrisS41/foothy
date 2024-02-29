import React, { Component } from 'react';
import axios from "axios";
import styles from "./styles/Images.module.css";

var flag = 2;
var compFlag = 2;
var imgs = new Array();
var data = {};
var click = 0;

function processImages(imgData) {
    return new Promise((res, rej)=>{
        var reader = new FileReader();
        reader.readAsDataURL(imgData);

        reader.addEventListener("load", (e)=>{
            var dtSt = reader.result.search(/base64,/g); //after this the data will start
            data[imgData.name] = reader.result.slice(dtSt + 7); //Store the slide data
            res("This");
        });
    }).then(res=>{
        console.log(`${res}`);
        flag = flag << 1;
        if(flag == compFlag) {
            document.getElementById("submit").style.display = "block";
        }
    }).catch(err=>{});
}

async function ensureTesting() {

    console.log("------ Begin processing ------");

    for(var  i = 0; i < imgs.length;) {
        
        var processed = await processImages(imgs[i]);

        i++;
    }

    console.log("------ Everything has been Processed ------");
    data["txt"] = false;

}

/*function clickSub() {
    click = 1;
}*/

class Images extends Component {

    /*componentDidMount() {
        if(click == 1) {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "localhost:5000/xhr", false);
            xhr.setRequestHeader("Content-Type", "application/json");

            xhr.onload = () => {

                console.log(xhr.response);
                document.getElementById("test").value = "";
                document.getElementById("submit").disabled = true;

            };

            xhr.send(JSON.stringify({"test": "testing"}));
        }
    }*/

    loadImage() {
        var fileUpload = document.getElementById("test");
        console.log(fileUpload.files);
        var disArea = document.getElementById("displayArea");

        for(var i = 0; i < fileUpload.files.length; i++) {
            var img = document.createElement("IMG");
            img.src = URL.createObjectURL(fileUpload.files[i])
            disArea.append(img);
        }

        imgs = fileUpload.files;

        compFlag = compFlag << fileUpload.files.length;

        ensureTesting();
    }

    testClickXHR() {

        console.log(data);

        axios.post("https://currserver.herokuapp.com/xhr", 
        JSON.stringify(data), 
        {headers: { 'Content-Type': 'application/json' }}
        ).then(res=>{
            document.getElementById("displayArea").innerHTML = "";
            console.log(res.data);
        });

    }

    render() {
        return(
            <div className={styles.bodyBlock}>
                <input type="file" name="file_upload" className={styles.fileUpload} id="test" multiple onChange={this.loadImage}/>

                <div className={styles.displayImages} id="displayArea">

                </div>

                <button id="submit" className={this.button} onClick={this.testClickXHR}>submit</button>
            </div>
        );

    };

}

export default Images