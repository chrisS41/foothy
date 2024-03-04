import React, {Component} from 'react';
import './styles/ViewAccount.css'
import RecipeListingTemplate from '../components/RecipeListingTemplate'
import ProfileHeader from '../components/ProfileHeader'
import defaultRecipe from './img/lukas-blazek-f-TWhXOrLiU-unsplash.jpg'
import axios from 'axios';
import config from "./../config/config.json"

class ViewAccount extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            username: "",
            myRecipes: [],
            data: {}
        }
    }

    componentDidMount = async() => {
        try {
            await axios.post(config.BE.Addr + '/user/get', 
            JSON.stringify({"username": window.sessionStorage.getItem("username")}), 
            {
                mode: "cors",
                headers: {"Content-Type": "application/json"}
            })
                .then(res => {
                    if (res.status === 200) {
                        console.log(res.data.username)
                        this.setState({
                            firstName: res.data.firstName,
                            lastName: res.data.lastName,
                            username: res.data.username
                        });
                        /*res.json().then(result => {
                            //console.log(result);
                            this.setState({
                                firstName: result.firstName,
                                lastName: result.lastName,
                            });
                        })*/
                    }
                    else if(res.status === 401) {
                        alert("failed to load user info");
                    }
                    else    alert("Error: view account");
                })


            await axios.post(config.BE.Addr + '/getMyRecipes', 
            JSON.stringify({"username": window.sessionStorage.getItem("username")}), 
            {
                mode: "cors",
                headers: {"Content-Type": "application/json"}
            })
            .then(res => {
                if(res.status === 200) {
                    console.log(res.data)
                    this.setState({
                        data: res.data,
                        myRecipes: res.data
                    })
                    console.log(this.state.data)
                    /*res.json().then(result => {
                        this.setState({
                            myRecipes: result
                        })
                    })*/
                }
                else    alert("Error: failed to load your recipes");
            })
        } catch (e) {
            alert("view account" + e);
        }
    }

    render(){
        let fullName = this.state.firstName + " " + this.state.lastName;
        let createdRecipesCount = this.state.myRecipes.length;
        return(
            <div class="profilePage">
                
                <ProfileHeader profilePic="https://media.istockphoto.com/photos/self-portrait-picture-of-a-man-on-the-top-of-the-mountain-picture-id1209510443?k=6&m=1209510443&s=612x612&w=0&h=qrkk2kze0JOQ5IsczrC7ZK5t0wOZqgv42K0L9yVil3I="
                    userName={fullName}
                    userBio="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vitae placerat orci, eget pharetra nulla." />
                <div class="createdRecipesTitle">Your Created Recipes ({createdRecipesCount})</div>
                <div class="createdList">
                    
                    {(this.state.myRecipes.map(recipe =>
                        < RecipeListingTemplate data={this.state.data} usId={true} user={this.state.username} key={recipe.recipeID} title={recipe.recipe_name} id={recipe.recipeID}
                            image={recipe.images == null ? defaultRecipe : JSON.parse(recipe.images)["0"]}
                            tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                    ))}
                    {/*}
                    <RecipeListingTemplate title="Fried Rice" image="https://media.istockphoto.com/photos/chicken-fried-rice-picture-id945606006?k=6&m=945606006&s=612x612&w=0&h=fZWJklaZpqhcVFU7v8Tc2d0S9OQu0pU9tvk9NxCira4=" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                    <RecipeListingTemplate title="Fried Rice" image="https://media.istockphoto.com/photos/chicken-fried-rice-picture-id945606006?k=6&m=945606006&s=612x612&w=0&h=fZWJklaZpqhcVFU7v8Tc2d0S9OQu0pU9tvk9NxCira4=" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                    <RecipeListingTemplate title="Fried Rice" image="https://media.istockphoto.com/photos/chicken-fried-rice-picture-id945606006?k=6&m=945606006&s=612x612&w=0&h=fZWJklaZpqhcVFU7v8Tc2d0S9OQu0pU9tvk9NxCira4=" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                    <RecipeListingTemplate title="Fried Rice" image="https://media.istockphoto.com/photos/chicken-fried-rice-picture-id945606006?k=6&m=945606006&s=612x612&w=0&h=fZWJklaZpqhcVFU7v8Tc2d0S9OQu0pU9tvk9NxCira4=" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                    <RecipeListingTemplate title="Fried Rice" image="https://media.istockphoto.com/photos/chicken-fried-rice-picture-id945606006?k=6&m=945606006&s=612x612&w=0&h=fZWJklaZpqhcVFU7v8Tc2d0S9OQu0pU9tvk9NxCira4=" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                    <RecipeListingTemplate title="Fried Rice" image="https://media.istockphoto.com/photos/chicken-fried-rice-picture-id945606006?k=6&m=945606006&s=612x612&w=0&h=fZWJklaZpqhcVFU7v8Tc2d0S9OQu0pU9tvk9NxCira4=" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
        {*/}

                </div>
            </div>
        )
    }
}

export default ViewAccount;