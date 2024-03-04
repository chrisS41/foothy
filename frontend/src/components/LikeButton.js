import React from 'react';
import './styles/LikeButton.css';
import { FaHeart, FaThinkPeaks } from "react-icons/fa"
import axios from 'axios';
// import * as FaIcons from 'react-icons/fa';
import config from "./../config/config.json"

class LikeButton extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      recipeID: this.props.id,
      liked: false,
      isLoading: true,
      //_isMounted: false
    }
    //this.getLikes = this.getLikes.bind(this)
  };

  async getLikes() {
    try {
      if (window.sessionStorage.getItem('islogin') == 'false') {
        //if (this._isMounted) {
          this.setState({
            like: false,
            //isLoading: false
          });
        //}
      }
      else {
        //console.log(this.state.recipeID);
        await axios.post(config.BE.Addr + '/likeCheck',
          JSON.stringify({
            recipeID: this.state.recipeID,
            username: window.sessionStorage.getItem('username')
          }),
          {
            mode: "cors",
            headers: { 'Content-Type': 'application/json' },
          })
          .then(res => {
            if (res.status === 200) {
              //if (this._isMounted) {
                this.setState({
                  like: res.data["liked"],
                  //isLoading: false
                });
              //}
              /*res.json().then(result => {

                //alert(result.islogin);
                if (this._isMounted){
                this.setState({
                    liked: result,
                    isLoading: false
                })
              }
              })*/
            }
            else if (res.status === 401) {
              alert("like data load failed");
            }
          })
      }
    } catch (e) {
      alert("LikeButton " + e);
    }
  }
  componentDidMount() {
    this._isMounted = true;
    console.log('mounting!!!')
    this.getLikes()
  }

  componentWillUnmount() {
    console.log('unmounting!!!')
    this.liked = false
    this._isMounted = false
  }



  /*
  state = {
      liked: false
  }
  */
  toggleLike = async (state) => {
    try {
      /*await fetch('/likeButtonClick', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeID: this.state.recipeID
        })
      })*/
      if (window.sessionStorage.getItem('islogin') == 'false') {
        alert("login first to like the post");
      }
      else {
      await axios.post(config.BE.Addr + '/likeButtonClick',
                JSON.stringify({
                    username: window.sessionStorage.getItem('username'),
                    recipeID: this.state.recipeID
                }), {
                mode: "cors",
                headers: { 'Content-Type': 'application/json' }
            })
        .then(res => {
          if (res.status === 200) {
            this.setState({
              liked: !this.state.liked
            })
          }
          else if (res.status === 401) {
            alert("Login first to like the post");
          }
          else {
            alert("like button click error");
          }
        })
      }
    }
    catch (e) {
      alert("LikeButton2 " + e);
    }
  }

  render() {

    const changeColor = !this.state.liked ? "grey" : "red"

    return (
      <div>
        <button className="LikeButton"
          onClick={this.toggleLike}>
          <FaHeart className="fas fa-heart fa-lg" size={28} style={{ color: changeColor }} />
        </button>
      </div>
    )
  }
}

export default LikeButton;