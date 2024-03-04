import React, { useEffect, useState } from 'react'
import { CommentForm } from '../components/CommentForm';
import CommentTemplate from '../components/CommentTemplate';
import SingleRecipeContent from '../components/SingleRecipeContent';
import SingleRecipeTemp from '../components/SingleRecipeTemp'
import Switch from '../components/Switch';
import Voter from '../components/Voter';
import LikeButton from '../components/LikeButton';
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/BeatLoader";
import {useLocation} from "react-router-dom";
import axios from 'axios';
import { GiConsoleController } from 'react-icons/gi';

const override = css`
  display: block;
`;

const SingleRecipePage = ({ match }) => {
  const mtch = {match}
  //console.log(match)
  let location = useLocation();
  
  const [item, setItem] = useState({
    title: null,
    sourceUrl: null, sourceName: null, image: null, readyInMinutes: null,
    instructions: null, ingredients: [], summary: null, unit: null, amount: null,
    serving: null, aggregateLikes: null, loading: true, healthRating: 0,

  })
  const [page, changePage] = useState("");
  const [users, changeUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState({value: false, loading: true});
  const [username, setUsername] = useState({value: "Guest", loading: true});
  const [comments, setComments] = useState([]);

  useEffect(async() => {
    if (match.params.id > 0){
    requestOptions.body = JSON.stringify({ id: match.params.id })
    
    fetchItem()

      if(window.sessionStorage.getItem("islogin") == 'true') {
        console.log("FUCK");
          setIsLoggedIn({
            value: true,
            loading: false
          });
          setUsername({
            value: window.sessionStorage.getItem("username"),
            loading: false
          })
      }

      try {
        await axios.post("config.BE.Addr/getComments", 
        JSON.stringify({recipeID: match.params.id}), 
        {
          mode: "cors", 
          headers: {"Content-Type": "application/json"}
        }).then(res=>{
          if (res.status === 200) {
            console.log(res.data);
            setComments(res.data);
            /*res.json().then(result => {
              //console.log(result);
              setComments(result);
              //console.log(comments);
            })*/
          }
          else if (res.status === 400) {
            alert("no comment");
          }
          else {
            alert("failed to load comments");
          }
        })
      } catch (e) {
        alert("SingleRecipePage " + e);
      }

    }
    else{
      setItem({
        title: location.state.title, sourceName: location.state.sourceName,
        sourceUrl: location.state.sourceUrl, image: location.state.image, ingredients: location.state.ingredients,
        instructions: location.state.instructions, summary: null, serving: location.state.serving, aggregateLikes: 0,
        readyInMinutes: location.state.readyInMinutes, loading: false
      })
    }
  }, []);


  // Request options for recipe
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { id: null, path: "" }
  }
  /**
     * @fetchItem : handler for getting more details about the given recipe
     * @param {event} event 
     * @returns JSON format information about the given recipe ID
     */
  const fetchItem = async () => {
    // Call pickQuery to set request options
    //if(match.query)
    let obj = JSON.parse(requestOptions.body)
    console.log(obj);
    if(location["pathname"].search(/userResult/g) !== -1) {
      obj.path = "userResult";
    } else {
      obj.path = "results";
    }
    let query = JSON.stringify(obj);
    console.log(query);
    if(query === null) {
      console.log("No match");
    } else {
      if(obj.path == "results") {
        //GROSS HOT FIX, BUT IT CAN WORK
        if(parseInt(window.sessionStorage.getItem("refresh")) == 0) {
          window.sessionStorage.setItem("refresh", 1)
          window.location.reload();
        }
        try {
          await axios.post(`config.BE.Addr${match.url}`, 
          query, 
          {
            mode: "cors", 
            headers: {"Content-Type": "application/json"}
          }).then((res)=>{
            console.log(res.data);
            changePage("results");
            setItem({
              title: res.data['title'], sourceName: res.data['sourceName'],
              sourceUrl: res.data['sourceUrl'], image: res.data['image'], ingredients: res.data['extendedIngredients'],
              instructions: res.data['instructions'], summary: res.data['summary'], unit: res.data['unit']
              , amount: res.data['amount'], serving: res.data['serving'], aggregateLikes: res.data['aggregateLikes'],
              readyInMinutes: res.data['readyInMinutes'], loading: false
            })
          })
        } catch (e) {
          console.log(e);
        }
      } else {
        var pos = 0;
        for(var i = 0; i < location.state.data.length; i++) {
          if(parseInt(match.params["id"]) == location.state.data[i]["recipeID"]) {
            pos = i;
          }
        }
        changePage("userResults")
        var ingredientsList = new Array();
        var imgObj = JSON.parse(location.state.data[pos]["images"]);
        var ingObj = JSON.parse(location.state.data[pos]["ingredients"])
        var stpObj = JSON.parse(location.state.data[pos]["steps"])
        changeUser(location.state.data[pos]["username"]);
        for(const ing in ingObj) {
          var str = ingObj[ing]["qty"] + " " + ingObj[ing]["units"] + " " + ingObj[ing]["name"];
          var object = {originalString: str}
          ingredientsList.push(object);
        }
        var stpStr = ""
        for(const stps in stpObj) {
          stpStr += stpObj[stps] + "\n";
        }
        setItem({
          title: location.state.data[pos]["recipe_name"], sourceName: "",
          sourceUrl: "", image: imgObj[0], ingredients: ingredientsList,
          instructions: stpStr, summary: "", unit: ""
          , amount: "", serving: location.state.data[0]['serving'], aggregateLikes: 0,
          readyInMinutes: location.state.data[0]["cookTime"], loading: false
        })
      }
    }
    /*if(match.pathname.search(/userResults/g) !== -1) {
      query.body["page"] = "user";
    } else {
      query.body["page"] = "spoon";
    }
    console.log("query")*/

  /*if (query === null) {
      console.log('No Match');
      /**
       *  @todo: // Pop up 'Invalid Input' implementation needed
       */

      //return;
    //}
    // Pass request and get result, update recipes and redirect
    /*try {
      let result = await fetch(match.url, query)
      return result.json()
      await axios.post(`config.BE.Addr${match.url}`, 
      JSON.stringify({}))
    } catch (e) {
      console.log(e)
    }*/
  }
  /*
    <div>
        <LikeButton id={match.params.id} />
      </div>
  */
  //const isLoggedIn = window.sessionStorage.getItem('islogin');
  return (
    <div>

      <div className="SwitchClass">

      </div>

      
{/* 
      <div>
        {(!isLoggedIn.loading && !username.loading ) ?
         <Voter id={match.params.id} username={username.value} islogin={isLoggedIn.value} />
          : null}
      </div> */}
      

      {/*The SingleRecipeContent Component takes in a title, a source, an image, a health rating, serving size, cook time, an array of ingredients, and an array of steps. The "source" is either the username of a community member, or it is the source of the recipe from the database (the website the api found it from). */}
      <div className="recipeContent">
        <div id="sweetLoading">
          <ClipLoader css={override} size={15} color={"#063D28"} loading={item.loading} />
        </div>

        
        {item.title ?

          <SingleRecipeContent pages={page} user={users} title={item.title} source={item.sourceName ? item.sourceName : "original source"}
            image={item.image} ingredients={item.ingredients}
            steps={item.instructions} id={match.params.id}
            unit={item.unit} sourceUrl={item.sourceUrl} amount={item.amount}
            serving={item.serving} aggregateLikes={item.aggregateLikes} readyInMinutes={item.readyInMinutes}
          />
          : null

        }
        

      </div>
      {!item.loading ?
        <div>
          <div className="comment-form-container">
            {isLoggedIn.value === true ? <CommentForm username={username.value} id={match.params.id} /> : <div className="login-message" style={{ textAlign: 'center', margin: 10, marginTop: 50, marginBottom: 50 }}><strong>Please sign in/register to post a comment.</strong></div>}
          </div>
          <div>
            {comments.map(oneComment => {
              return (
                <React.Fragment key={oneComment.username}>
                  <CommentTemplate profilePic="https://media.istockphoto.com/photos/self-portrait-picture-of-a-man-on-the-top-of-the-mountain-picture-id1209510443?k=6&m=1209510443&s=612x612&w=0&h=qrkk2kze0JOQ5IsczrC7ZK5t0wOZqgv42K0L9yVil3I="
                    userName={oneComment.username}
                    datePosted={oneComment.date}
                    comment={oneComment.comment} />
                </React.Fragment>
              )
            })}
            {/*
            <CommentTemplate profilePic="https://media.istockphoto.com/photos/self-portrait-picture-of-a-man-on-the-top-of-the-mountain-picture-id1209510443?k=6&m=1209510443&s=612x612&w=0&h=qrkk2kze0JOQ5IsczrC7ZK5t0wOZqgv42K0L9yVil3I="
              userName="John Doe"
              datePosted="4/1/21"
              comment="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vitae placerat orci, eget pharetra nulla. Pellentesque quis enim nec nulla dapibus pulvinar. Curabitur varius libero sed hendrerit auctor. Integer mauris justo, laoreet eget rutrum eget, laoreet in massa. Nunc venenatis nisl ipsum, nec vestibulum orci efficitur id. Mauris hendrerit feugiat quam, ut hendrerit ex molestie accumsan. Suspendisse neque turpis, aliquet semper dui sit amet, aliquam fermentum nunc." />
            <CommentTemplate profilePic="https://media.istockphoto.com/photos/self-portrait-picture-of-a-man-on-the-top-of-the-mountain-picture-id1209510443?k=6&m=1209510443&s=612x612&w=0&h=qrkk2kze0JOQ5IsczrC7ZK5t0wOZqgv42K0L9yVil3I="
              userName="John Doe"
              datePosted="4/1/21"
              comment="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />
            */}
          </div>
        </div> :
        null}
    </div>
  );
};

export default SingleRecipePage;