import React, { Component } from 'react';
import './styles/FavoriteList.css'
import RecipeListingTemplate from '../components/RecipeListingTemplate.js'
import defaultRecipe from './img/lukas-blazek-f-TWhXOrLiU-unsplash.jpg'
import axios from "axios";
import { BiWindows } from 'react-icons/bi';

// axios.defaults.withCredentials = true;

class FavoriteList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
    };
  }

  async componentDidMount() {
    try {
      //await fetch('/favoriteList')

      await axios.post('https://currserver.herokuapp.com/favoriteList', 
      JSON.stringify({
        username: window.sessionStorage.getItem('username')
      }), {
        mode: "cors",
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => {
          if (res.status === 200) {
            //res.json().then(result => {
            this.setState({
              recipes: res.data
            })
            //})
          }
          else if (res.status === 401) {
            alert("favorite data load failed");
          }
        })
    } catch (e) {
      alert("favorite list " + e);
    }
  }

  render() {
    return (
      <div className="favoritesPage">
        <h1 className="favoritesHeader">Favorite Recipes</h1>
        <div className="favoritesSpacer"></div>

        <div className="favoritesRows">
          {this.state.recipes.map(recipe => {
            return (
              <React.Fragment key={recipe.id}>
                <RecipeListingTemplate title={recipe.title} 
                id={recipe.id}
                image={recipe.image}
                healthRating={recipe.healthScore} />
              </React.Fragment>
            )
          })}
          {/*NOTE: This is dummy data for testing, replace with back-end api.
                    <RecipeListingTemplate healthRating="3" title="Fried Rice" image="https://media.istockphoto.com/photos/chicken-fried-rice-picture-id945606006?k=6&m=945606006&s=612x612&w=0&h=fZWJklaZpqhcVFU7v8Tc2d0S9OQu0pU9tvk9NxCira4=" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                    <RecipeListingTemplate healthRating="2" title="New York Style Cheese Pizza" image="https://cdn.pixabay.com/photo/2017/12/05/20/09/pizza-3000274_960_720.jpg" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                    <RecipeListingTemplate healthRating="1" title="Fried Chicken with dipping Sauce" image="https://cdn.pixabay.com/photo/2017/09/03/01/17/wings-2709068_960_720.jpg" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                    <RecipeListingTemplate title="Simple Cheesecake" image="https://cdn.pixabay.com/photo/2010/12/02/cake-862_960_720.jpg" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                    <RecipeListingTemplate title="Fried Rice" image="https://media.istockphoto.com/photos/chicken-fried-rice-picture-id945606006?k=6&m=945606006&s=612x612&w=0&h=fZWJklaZpqhcVFU7v8Tc2d0S9OQu0pU9tvk9NxCira4=" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                    <RecipeListingTemplate title="Fried Rice" image="https://media.istockphoto.com/photos/chicken-fried-rice-picture-id945606006?k=6&m=945606006&s=612x612&w=0&h=fZWJklaZpqhcVFU7v8Tc2d0S9OQu0pU9tvk9NxCira4=" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                    <RecipeListingTemplate title="Fried Rice" image="https://media.istockphoto.com/photos/chicken-fried-rice-picture-id945606006?k=6&m=945606006&s=612x612&w=0&h=fZWJklaZpqhcVFU7v8Tc2d0S9OQu0pU9tvk9NxCira4=" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                    <RecipeListingTemplate title="Fried Rice" image="https://media.istockphoto.com/photos/chicken-fried-rice-picture-id945606006?k=6&m=945606006&s=612x612&w=0&h=fZWJklaZpqhcVFU7v8Tc2d0S9OQu0pU9tvk9NxCira4=" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                    {/*End of favorite recipes*/}
        </div>
      </div>
    )
  }
}

export default FavoriteList;
