import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import './styles/CarouselListing.css'


class RecipeCarousel extends Component {

    constructor(props) {
        super(props);
        /*The recipe card needs at least this info passed to it in order to display correctly. The tags value needs an array of tags (no more than 5).*/
        this.state = {
            title : this.props.title, 
            image : this.props.image,
            tags : this.props.tags,
            recipe: this.props.recipe
        };

        this.renderListing = this.renderListing.bind(this);
    
    }
    // A simple function that prevents the user from draging the images
    preventDragHandler = (e) => {
        e.preventDefault();
      }

    renderListing() {
        
        return (
           
            
            <div>
                {/* <Link to={{pathname: `/result/${this.state.recipe.id}`,
            state: this.state.recipe }}> */}
            <img className="carsouselRecipeImage" src={this.state.image} alt="recipe_image" onDragStart={this.preventDragHandler}/> 
            {/* </Link> */}
            
            
            </div>
            
        );
    };

    render() {
      
        return (
            <div>
            <Link to={{pathname: `/result/${this.state.recipe.id}`,
            state: this.state.recipe }}>
            <div className="carsouselRecipeCard">
                {this.renderListing()}
                 
            </div>
               </Link>
            
            <h2 className="carsouselRecipeTitle">{this.state.title}</h2> 
            </div>
            
        );
    };
}

export default RecipeCarousel;