import React, { Component } from 'react';
import './styles/SingleRecipeContent.css'
import ClipLoader from "react-spinners/BeatLoader";
import * as ShareButtons from '../components/ShareRecipeButtons';
import { FaExclamationTriangle } from 'react-icons/fa';
import SingleRecipeHealthRating from './SingleRecipeHealthRating';
import { ReportPostPopup } from './ReportPostPopup';
import LikeButton from '../components/LikeButton';
import Voter from '../components/Voter';

class SingleRecipeContent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user,
            pages: this.props.pages,
            title: this.props.title,
            image: this.props.image,
            ingredients: this.props.ingredients,
            source: this.props.source, /*The source can be a username if posted by a member of the community, or it can be the website which the api pulled the recipe from if it is from the database*/
            steps: this.props.steps,
            url: window.location.href,
            sourceUrl: this.props.sourceUrl,
            healthRating: this.props.healthRating,
            reportPopupOpen: false,
            readyInMinutes: this.props.readyInMinutes,
            aggregateLikes: this.props.aggregateLikes,
            serving: this.props.serving,
            id: this.props.id
        };

        this.renderIngredientsList = this.renderIngredientsList.bind(this);
        this.renderSteps = this.renderSteps.bind(this);
        this.toggleReportPopup = this.toggleReportPopup.bind(this);
        console.log(this.state.user)
    }

    renderIngredientsList() {
        var listOfIngredients;
        if (this.state.ingredients[0].originalString) {
            listOfIngredients = this.state.ingredients.map(((ingredient) =>
                <li key={ingredient.originalString} className="ingredientListItem">
                    {ingredient.originalString}</li>));
        }
        else if (this.state.ingredients[0].original) {
            listOfIngredients = this.state.ingredients.map(((ingredient) =>
                <li key={ingredient.original} className="ingredientListItem">
                    {ingredient.original}</li>));
        }
        else {
            listOfIngredients = this.state.ingredients.map(((ingredient) =>
                <li key={ingredient.name} className="ingredientListItem">
                    {ingredient.name} {ingredient.amount} {ingredient.unit}</li>));
        }
        return (
            <ul className="ingredientsList">
                {listOfIngredients}
            </ul>
        )
    }

    renderSteps() {
        const listOfSteps = this.state.steps;
        return (
            // <ol className="stepsList">
            { listOfSteps }
            // </ol>
        )
    }

    toggleReportPopup() {
        return this.setState({
            ...this.state,
            reportPopupOpen: !this.state.reportPopupOpen
        })
    }



    render() {
        return (
            <div className="header">
                <div>
                    
                    <div className="TitleBox">
                        <h1  className="recipeHeaderTitle">{this.state.title}</h1>
                            <div className="LikeFix">
                                <LikeButton id={this.state.id} />
                            </div>
                    </div>
                    
                    <a href={this.state.sourceUrl}><h5 className="source"> By: {this.state.source}</h5></a>
                    <div className="social-share-container">
                        <div className="social-share-label">Share this recipe: </div>
                        <div className="share-button-container">
                            <ShareButtons.FacebookButton title={this.state.title} url={this.state.url} />
                        </div>
                        <div className="share-button-container">
                            <ShareButtons.TwitterButton title={this.state.title} url={this.state.url} />
                        </div>

                        <div className="report-container">
                            <button className="report-link" onClick={() => this.toggleReportPopup()}>
                                <FaExclamationTriangle /> Report
                        </button>
                            {this.state.reportPopupOpen ? <ReportPostPopup onClose={() => this.toggleReportPopup()} /> : ''}
                        </div>
                    </div>

                    <div className="pictureBlock">
                        {this.state.pages == "results" ? <img className="headerImage" src={this.state.image} /> : <img className="headerImage" src={(this.state.user !== null) ? `http://currserver.herokuapp.com/${this.state.user}/${this.state.image}` : this.state.image} />}
                        <div className="pictureSubHeader">
                            <h3 className="cookTimeHeader">Servings: {this.state.serving}</h3>
                            {this.state.pages == "results" ? <h3 className="servingsHeader">Time: {this.state.readyInMinutes} min</h3> : <h3 className="servingsHeader">Time: {this.state.readyInMinutes}</h3>}
                        </div>
                        
                    </div>
                    <div className="ingredientsBlock">
                        <div className="healthRating">
                            {this.state.pages == "results" ? <SingleRecipeHealthRating rating={this.state.healthRating} /> : null}
                            
                        </div>
                        <h3 className="ingredientsHeader">Required Ingredients</h3>
                        <div className="separationBar"></div>
                        <div>{this.renderIngredientsList()}</div>
                    </div>
                    {this.state.steps ?
                        <div>
                            <div className="stepsHeader"><h2>Cooking Instructions</h2></div>
                            <div className="separationBar"></div>
                            <div dangerouslySetInnerHTML={{ __html: this.state.steps }} />
                        </div>
                        : (
                            <div className="stepsHeader"><h2>Instructions Not Available </h2></div>)
                    }
                </div>
            </div>
        );
    }

}

export default SingleRecipeContent;