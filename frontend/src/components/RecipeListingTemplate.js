import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import LikeButton from "./LikeButton.js"
import { BsQuestionCircleFill } from 'react-icons/bs';

import './styles/RecipeListingTemplate.css'

class RecipeListingTemplate extends Component {

    constructor(props) {
        super(props);
        /*The recipe card needs at least this info passed to it in order to display correctly. The tags value needs an array of tags (no more than 5).*/
        this.state = {
            data: this.props.data,
            usId: this.props.usId,
            user: this.props.user,
            title: this.props.title,
            image: this.props.image,
            tags: this.props.tags,
            id: this.props.id,
            redirect: false,
            healthRating: this.props.healthRating,
        };

        this.renderListing = this.renderListing.bind(this);
        this.renderTags = this.renderTags.bind(this);
        // this.loadPage = this.loadPage.bind(this);
        this.renderHealthRating = this.renderHealthRating.bind(this);
    }

    /*Note: ideally, each listing should have a maximum of 4-5 tags displayed on the results page. If there are more than 4-5 tags for a specific recipe, the rest will be invisible until a user actually opens the recipe in a new page.*/
    renderTags() {
        console.log(this.state.data);
        const tagsList = this.state.tags.map(((tag) => <button className="singleTag"><p className="singleTagText">{tag}</p></button>)); /*Note: html type of each tag may change, depending on what functionality gets assigned to them. For now, they are buttons*/
        return (
            <div className="tagList">
                {tagsList}
            </div>
        );

    };

    renderHealthRating() {
        if (this.state.healthRating == 1)
            return (
                <h4 className="healthRatingHeader"><Link to="/help" className="ratingLink"><button className="ratingLinkButton"><BsQuestionCircleFill /></button></Link>Health Rating: <span className="emoji">🥑</span></h4>
            );
        else if (this.state.healthRating == 2)
            return (
                <h4 className="healthRatingHeader"><Link to="/help" className="ratingLink"><button className="ratingLinkButton"><BsQuestionCircleFill /></button></Link>Health Rating: <span className="emoji">🥑 🥑</span></h4>
            );
        else
            return (
                <h4 className="healthRatingHeader"><Link to="/help" className="ratingLink"><button className="ratingLinkButton"><BsQuestionCircleFill /></button></Link>Health Rating: <span className="emoji">🥑 🥑 🥑</span></h4>
            );
    };

    //<img className="recipeImage" src={this.state.image} alt="recipe_image"/>
    renderListing() {
        return (

            <div className="card"> <Link className="recipeLink" to={{pathname: (!this.state.usId) ? `/result/${this.state.id}` : `/userResult/${this.state.id}`,
            state: {healthRating: this.state.healthRating, data: this.state.data}}}>
                <img className="recipeImage" src={(this.state.user !== null && this.state.user !== undefined) ? `config.BE.Addr/${this.state.user}/${this.state.image}` : this.state.image} alt="recipe_image" />
                <div className="favoriteBlock">
                    <LikeButton className="favoriteButton" id={this.state.id} style={{
                        height: '40px',
                        padding: '0px 7px',
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '50%'
                    }} />
                </div>
            </Link>
                <div style={{ display: 'inline-block' }}>
                    {this.renderHealthRating()}
                </div>
                <div>
                    <h2 className="recipeTitle">{this.state.title} {this.state.user}</h2>
                </div>

            </div>
        );
    };

    render() {
        // const {redirect} = this.state;
        // if (redirect) {
        //     return <Redirect to='/'/>;
        //   }

        return (
            <div className="recipeCard">
                {this.renderListing()}
                {/* <div><p className="tagText">Tags:</p>{this.renderTags()}</div> */}

            </div>
        );
    };

}


export default RecipeListingTemplate;