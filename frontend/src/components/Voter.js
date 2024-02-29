import React from 'react'
import './styles/Voter.css';
import io from "socket.io-client";
import axios from 'axios';

//const socket = io();

class Vote extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            recipeID: this.props.id,
            username: this.props.username,
            vote: 0,
            score: 0,
            islogin: this.props.islogin,
            _isMounted: false
        }
        this.getVotes = this.getVotes.bind(this);
    };

    socket = new io();

    // Score is score of the post 
    // Vote is the users current vote: 
    // 0 if no vote
    // 1 if up vote
    // -1 if down vote 
    //state = {vote: 0, score: 0 }

    vote(type) {
        if (this.state.islogin) {
            var temp = (this.state.vote === type ? 0 : type);
            //console.log(temp + " temp");
            this.socket.emit("voteClick", {
                recipeID: this.state.recipeID,
                username: this.state.username,
                vote: temp
            });
            this.setState({
                vote: temp
            })
        }
        else {
            alert("Login first to vote");
        }
        /*this.setState(state => ({
            vote: state.vote === type ? 0: type 
        }))*/
    }

    async getVotes(){
        try {
            await axios.post('https://currserver.herokuapp.com/voteCheck',
                JSON.stringify({
                    recipeID: this.state.recipeID
                }), {
                mode: "cors",
                headers: { 'Content-Type': 'application/json' }
            })
            /*
            await fetch('/voteCheck', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipeID: this.state.recipeID
                })
            })*/
                .then(res => {
                    if (res.status === 200) {
                        //res.json().then(result => {
                            //console.log(result+"aaa");
                            if (this._isMounted){
                            this.setState({
                                vote: res[1],
                                score: res[0]
                            })
                        }
                    }                    
                    else if (res.status === 401) {
                        alert("vote data load failed");
                    }
                })
        } catch (e) {
            alert("voter " + e);
        }
    }
    componentDidMount() {
        this._isMounted = true
        this.getVotes()
        // this.socket.on("scoreUpdate", (newScore) => {
        //     //console.log("new score" + newScore);
        //     if (this._isMounted){
        //     this.setState({
        //         score: newScore
        //     })
        // }
        // })
    }

    componentWillUnmount(){
        this._isMounted = false;
    }


    // How the UI should look according to the state 
    // ternary operator so that the class is 'active' if the user’s vote matches the button, 
    // or has no class at all because it evaluates to undefined
    // Made so user can only choose one, if they click on the other it swaps
    // If you click again on the one you clicked it will take it away 
    render() {
        const { vote, score } = this.state

        return (
            <main>
                <button className={vote === 1 ? 'activeUpArrow' : 'unactiveUpArrow'} onClick={() => this.vote(1)}>

                </button>
                <h1>{score}</h1>
                <button className={vote === -1 ? 'activeDownArrow' : 'unactiveDownArrow'} onClick={() => this.vote(-1)} >

                </button>
            </main>
        )
    }
};

export default Vote;
