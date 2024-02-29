import React, {Component} from 'react';

import './styles/CommentTemplate.css';

class CommentTemplate extends Component {

    constructor(props){
        super(props)
        this.state = {
            profilePic : this.props.profilePic,
            userName : this.props.userName,
            datePosted : this.props.datePosted,
            comment: this.props.comment
        }
    };

    render(){
        return (
            <div className="singleComment">
                <div className="userInfo">
                    <div className="circularContainer">
                        <img src={this.state.profilePic} alt="user_profile_picture" />
                    </div>
                    <div className="userName">{this.state.userName}</div>
                    <div className="date">{this.state.datePosted}</div>
                </div>
                <div className="commentText">{this.state.comment}</div>
            </div>
        );
    };

}

export default CommentTemplate;