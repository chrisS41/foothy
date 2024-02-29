import React, {Component} from 'react';
import { FaEdit } from "react-icons/fa"
import { BioForm } from './BioForm'
import { Blocker } from './Blocker';

import './styles/ProfileHeader.css'

class ProfileHeader extends Component {
    constructor(props){
        super(props)
        this.state = {
            profilePic : this.props.profilePic,
            userName : this.props.userName, 
            userBio : this.props.userBio,
            showBioForm: false
        }
    }

    openBioForm(){
        this.setState({
            showBioForm: true
        })
        console.log(this.state.showBioForm)
    }

    closeBioForm = () => {
        this.setState({
            showBioForm: false
        })
    }

    changeBio = (value) => {
        this.setState({
            userBio: value
        })
    }

    // changed this.state to this.props
    // not read value if with state...
    render(){
        return(
            <div className="profileHeader">
                {this.state.showBioForm? <div onClick={this.closeBioForm} className="darkBackground"></div> : null}
                <BioForm show={this.state.showBioForm} close={this.closeBioForm} bio={this.state.userBio} setBio={this.changeBio}/>
                
                <div class="pictureContainer">
                    <div id="circularContainer">
                        <img src={this.state.profilePic} alt="user_profile_picture" />
                    </div>
                </div>
                <div class="textPart">
                    <div id="userName">{this.props.userName}</div>
                    <div className="userBioContainer">
                        <div className="userBio">{this.state.userBio}</div>
                        <div class="editBio" onClick={() => this.openBioForm()} >
                            <FaEdit size={20}/>
                        </div>
                    </div>
                </div>

                
            </div>
        )
    }
}

export default ProfileHeader;






