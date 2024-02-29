import React, { Component } from 'react';

import './styles/RecipePage.css';
import FilterMenu from '../components/FilterMenu'
import RecipeListingTemplate from '../components/RecipeListingTemplate'
import SearchBar from '../components/SearchBar/SearchBar';
import defaultRecipe from './img/lukas-blazek-f-TWhXOrLiU-unsplash.jpg'
import { Link } from 'react-router-dom';
import { TiScissors } from 'react-icons/ti';

class RecipePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            header: 'Recipe',
            recipe: [],
            typeOfQuery: null,
            filterMode: false,
            filterRecipes: []            
        };
        this.renderHeader = this.renderHeader.bind(this);
        this.handleCallback = this.handleCallback.bind(this);
        this.renderFiltered = this.renderFiltered.bind(this);
        window.sessionStorage.setItem("refresh", 0);
        // this.clearFilter = this.clearFilter.bind(this);
    }

    renderHeader() {
        if (this.state.typeOfQuery) {
            var header = "Search results for: ";
            if (this.state.typeOfQuery.type == "ingredients") {
                header = header + this.state.typeOfQuery.type
                var ingredients = []
                var ingredientsExclude = []
                this.state.typeOfQuery.ingredients.map((ingredient) => {
                    ingredient[1] == 'add' ? ingredients.push(ingredient[0].toString()) : ingredientsExclude.push(ingredient[0].toString())
                })
            }
            else {
                var ingredients = this.state.typeOfQuery.query
            }
            header = header + " " + ingredients
            if (ingredientsExclude) {
                return (<div>
                    <h2>{header}</h2>
                    <h3>&emsp;Excluding: {ingredientsExclude}</h3>
                    <span> {this.state.filterMode ? this.state.filterRecipes.length : this.state.recipe.length} Results Found </span>
                    {this.state.filterMode ?
                        <button style={{
                            textDecoration:
                                'underline',
                            backgroundColor: 'transparent',
                            border: 'none',
                            fontSize: '17px'
                        }} onClick={() => { this.clearFilter() }}>clear filter</button>
                        : null}
                </div>)
            }
            return (
                <div>
                    <h2>{header}</h2>
                    <span> {this.state.filterMode ? this.state.filterRecipes.length : this.state.recipe.length} Results Found </span>
                    {this.state.filterMode ?
                        <button style={{
                            textDecoration:
                                'underline',
                            backgroundColor: 'transparent',
                            border: 'none',
                            fontSize: '17px'
                        }} onClick={() => { this.clearFilter() }}>clear filter</button>
                        : null}
                </div>)
        }
    }

    handleCallback(childData) {
        this.setState({ filterMode: true, filterRecipes: childData })
    }

    renderFiltered() {
        if (this.state.filterRecipes.length != 0 && this.state.filterMode) {
            console.log("Here 2")
            return (this.state.filterRecipes.map(recipe =>
                < RecipeListingTemplate key={recipe.id} title={recipe.title} id={recipe.id}
                    image={recipe.image ?
                        (!recipe.image.startsWith("https://spoonacular.com/recipeImages/") ? ("https://spoonacular.com/recipeImages/" + recipe.image)
                            : recipe.image) : defaultRecipe}
                    tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} 
                    healthRating={recipe.score}
                    />
            )
            )
        }
    }

    clearFilter() {
        console.log("clearing the filter!")
        this.setState({
            filterMode: false,
            filterRecipes: []
        })
        // this.state.filterMode = false;
        // this.state.filterRecipes = []

    }

    componentDidMount(prevProps) {
        if (this.props.location.state) {
            this.setState({
                recipe: this.props.location.state.id,
                typeOfQuery: this.props.location.state.typeOfQuery,
            })
        }
    }


    render() {
        if (this.state.recipe) {
            return (
                <div className="recipePage">
                    {/* <SearchBar/> */}
                    {this.renderHeader()}
                    {this.state.recipe.length != 0 ? <FilterMenu parentCallback={this.handleCallback} myRecipes={this.state.recipe} /> : null}
                    <div className="spacingBar" />
                    <div className="resultRows">
                        {/*THIS DATA IS TO BE DIS
                        CARDED, FOR TESTING PURPOSES ONLY */}
                        {/* if the response doesnt come with an image, provide a default one  */}
                        {!this.state.filterMode ?
                            (this.state.recipe.map(recipe =>
                                < RecipeListingTemplate key={recipe.id} title={recipe.title} id={recipe.id}
                                    image={recipe.image ?
                                        (!recipe.image.startsWith("https://spoonacular.com/recipeImages/") ? ("https://spoonacular.com/recipeImages/" + recipe.image)
                                            : recipe.image) : defaultRecipe}
                                    tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]}
                                    healthRating={recipe.score}
                                    />
                            )
                            )
                            : this.renderFiltered()}

                        {/*REPLACE WITH BACKEND API INTEGRATION ONCE IMPLEMENTED */}
                    </div>
                </div>

            );
        }
        /* else {
             return (
             <div className="recipePage">
                 <SearchBar />
                 <FilterMenu />
                 <div className="resultRows">
                     {/*THIS DATA IS TO BE DISCARDED, FOR TESTING PURPOSES ONLY }
                     <RecipeListingTemplate title="Fried Rice" image="https://media.istockphoto.com/photos/chicken-fried-rice-picture-id945606006?k=6&m=945606006&s=612x612&w=0&h=fZWJklaZpqhcVFU7v8Tc2d0S9OQu0pU9tvk9NxCira4=" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                     <RecipeListingTemplate title="New York Style Cheese Pizza" image="https://cdn.pixabay.com/photo/2017/12/05/20/09/pizza-3000274_960_720.jpg" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                     <RecipeListingTemplate title="Fried Chicken with dipping Sauce" image="https://cdn.pixabay.com/photo/2017/09/03/01/17/wings-2709068_960_720.jpg" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                     <RecipeListingTemplate title="Simple Cheesecake" image="https://cdn.pixabay.com/photo/2010/12/02/cake-862_960_720.jpg" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                     <RecipeListingTemplate title="Fried Rice" image="https://media.istockphoto.com/photos/chicken-fried-rice-picture-id945606006?k=6&m=945606006&s=612x612&w=0&h=fZWJklaZpqhcVFU7v8Tc2d0S9OQu0pU9tvk9NxCira4=" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                     <RecipeListingTemplate title="Fried Rice" image="https://media.istockphoto.com/photos/chicken-fried-rice-picture-id945606006?k=6&m=945606006&s=612x612&w=0&h=fZWJklaZpqhcVFU7v8Tc2d0S9OQu0pU9tvk9NxCira4=" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                     <RecipeListingTemplate title="Fried Rice" image="https://media.istockphoto.com/photos/chicken-fried-rice-picture-id945606006?k=6&m=945606006&s=612x612&w=0&h=fZWJklaZpqhcVFU7v8Tc2d0S9OQu0pU9tvk9NxCira4=" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                     <RecipeListingTemplate title="Fried Rice" image="https://media.istockphoto.com/photos/chicken-fried-rice-picture-id945606006?k=6&m=945606006&s=612x612&w=0&h=fZWJklaZpqhcVFU7v8Tc2d0S9OQu0pU9tvk9NxCira4=" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                     <RecipeListingTemplate title="Fried Rice" image="https://media.istockphoto.com/photos/chicken-fried-rice-picture-id945606006?k=6&m=945606006&s=612x612&w=0&h=fZWJklaZpqhcVFU7v8Tc2d0S9OQu0pU9tvk9NxCira4=" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                     <RecipeListingTemplate title="Fried Rice" image="https://media.istockphoto.com/photos/chicken-fried-rice-picture-id945606006?k=6&m=945606006&s=612x612&w=0&h=fZWJklaZpqhcVFU7v8Tc2d0S9OQu0pU9tvk9NxCira4=" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                     <RecipeListingTemplate title="Fried Rice" image="https://media.istockphoto.com/photos/chicken-fried-rice-picture-id945606006?k=6&m=945606006&s=612x612&w=0&h=fZWJklaZpqhcVFU7v8Tc2d0S9OQu0pU9tvk9NxCira4=" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                     <RecipeListingTemplate title="Fried Rice" image="https://media.istockphoto.com/photos/chicken-fried-rice-picture-id945606006?k=6&m=945606006&s=612x612&w=0&h=fZWJklaZpqhcVFU7v8Tc2d0S9OQu0pU9tvk9NxCira4=" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                     <RecipeListingTemplate title="Fried Rice" image="https://media.istockphoto.com/photos/chicken-fried-rice-picture-id945606006?k=6&m=945606006&s=612x612&w=0&h=fZWJklaZpqhcVFU7v8Tc2d0S9OQu0pU9tvk9NxCira4=" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                     <RecipeListingTemplate title="Fried Rice" image="https://media.istockphoto.com/photos/chicken-fried-rice-picture-id945606006?k=6&m=945606006&s=612x612&w=0&h=fZWJklaZpqhcVFU7v8Tc2d0S9OQu0pU9tvk9NxCira4=" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                     <RecipeListingTemplate title="Fried Rice" image="https://media.istockphoto.com/photos/chicken-fried-rice-picture-id945606006?k=6&m=945606006&s=612x612&w=0&h=fZWJklaZpqhcVFU7v8Tc2d0S9OQu0pU9tvk9NxCira4=" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                     <RecipeListingTemplate title="Fried Rice" image="https://media.istockphoto.com/photos/chicken-fried-rice-picture-id945606006?k=6&m=945606006&s=612x612&w=0&h=fZWJklaZpqhcVFU7v8Tc2d0S9OQu0pU9tvk9NxCira4=" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                     {/*REPLACE WITH BACKEND API INTEGRATION ONCE IMPLEMENTED }
                 </div>
             </div>
             );
         } 
         */
    };

}

export default RecipePage;