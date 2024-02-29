import React, {Component} from 'react';

import './styles/FilterMenu.css'
import {BiSliderAlt, RiHomeSmile2Fill, TiShoppingBag} from 'react-icons/all'


class FilterMenu extends Component {

constructor(props) {
    super(props)
    this.state = {
        showMenu: false,
        callBack: this.props.parentCallback,
        recipes: this.props.myRecipes,
        carbOption: null,
        fatOption: null,
        calorieOption: null,
        popularityOption: null,
        orginialRecipe: []
    };
    this.showFilterMenu = this.showFilterMenu.bind(this);
    this.applyFilterMenu = this.applyFilterMenu.bind(this);
    this.myRef = React.createRef();

    this.mouseListener = (event) => {
        const { current: wrap } = this.myRef;
        if (wrap && !wrap.contains(event.target)) {
          this.setState({showMenu:false});
        }
    }
}

componentDidMount(){
    console.log('mounting filter!')
    if (this.state.orginialRecipe.length == 0){
        this.state.orginialRecipe = this.state.recipes
    }
    window.addEventListener("mousedown",this.mouseListener );

}

componentWillUnmount(){
    console.log('unmounting filter!')
    window.removeEventListener("resize", this.switchListener);
}
showFilterMenu(clickEvent) {
    this.setState( {showMenu : !this.state.showMenu}) ;
}

applyFilterMenu(clickEvent) {
    clickEvent.preventDefault();
    console.log("carbOption", this.state.carbOption)
    console.log("fatOption", this.state.fatOption)
    console.log("calorieOption", this.state.calorieOption)
    console.log("popularityOption", this.state.popularityOption)
    console.log('Apply Filter Menu has these recipes',this.state.orginialRecipe)

    this.state.recipes = this.state.orginialRecipe
    
    if (this.state.calorieOption != null && this.state.calorieOption != "null"){
        console.log('11')
        this.state.recipes =  this.state.orginialRecipe.filter(recipe => 
            recipe.nutrition.nutrients[0].amount < this.state.calorieOption
        )
    }
   if (this.state.carbOption != null && this.state.carbOption != "null"){
    console.log('12')
        this.state.recipes =  this.state.orginialRecipe.filter(recipe => 
            recipe.nutrition.nutrients[3].amount < this.state.carbOption
        )
    }
    if (this.state.fatOption != null && this.state.fatOption != "null"){
        console.log('13')
        this.state.recipes =  this.state.orginialRecipe.filter(recipe => 
            recipe.nutrition.nutrients[2].amount < this.state.fatOption
        )
    }
    if (this.state.popularityOption != null && this.state.popularityOption != "null"){
        console.log('14')

    }
    this.setState({showMenu:false});
    this.state.calorieOption = null
    this.state.fatOption = null
    this.state.popularityOption = null
    this.state.carbOption = null
    console.log('send recipes',this.state.recipes)
    this.state.callBack(this.state.recipes)
}

render() {
    return(
            <div className="filterMenu">
                <button onClick={this.showFilterMenu} className="filterButton">Filter Results <BiSliderAlt className="filterMenuIcon"/></button>
                {
                    this.state.showMenu ? (
                            <div ref={this.myRef} className="filterCategories"> 
                                <h3 className="filterCategoryHeader">Filter By Popularity</h3>
                                <select name="Popularity" className="Popularity" onChange={(e)=>{
                                    this.state.popularityOption = e.target.value 
                                }}>
                                    <option value="null">---</option>
                                    <option value="Most Favorited">Most Favorited</option>
                                </select>
                                {/* <h3 className="filterCategoryHeader">Filter By Diet</h3>
                                <select name="Diet" className="Diet">
                                    <option value="N/A">---</option>
                                    <option value="Vegetarian">Vegetarian</option>
                                    <option value="Vegan">Vegan</option>
                                    <option value="Keto">Keto</option>
                                    <option value="Gluten Free">Gluten Free</option>
                                </select> */}
                                <h3 className="filterCategoryHeader">Filter By Fat</h3>
                                <select name="Fat" className="Diet" onChange={(e)=>{
                                    this.state.fatOption = e.target.value 
                                }}>
                                    <option value="null">---</option>
                                    <option value="5">Less Than 5g Fat</option>
                                    <option value="10">Less Than 10g Fat</option>
                                    <option value="20">Less Than 20g Fat</option>
                                    <option value="50">Less Than 50g Fat</option>
                                </select>
                                {/* <h3 className="filterCategoryHeader">Filter By Type</h3>
                                <select name="Dish Type" className="Dish Type">
                                    <option value="N/A">---</option>
                                    <option value="Snack">Snack</option>
                                    <option value="Appetizer">Appetizer</option>
                                    <option value="Entree">Entrée</option>
                                    <option value="Dessert">Dessert</option>
                                </select> */}
                                <h3 className="filterCategoryHeader">Filter By Carbs</h3>
                                <select name="Dish Type" className="Dish Type" onChange={(e)=>{
                                    this.state.carbOption = e.target.value 
                                }}>
                                    <option value="null">---</option>
                                    <option value="5">Less Than 5g Carbs</option>
                                    <option value="10">Less Than 10g Carbs</option>
                                    <option value="20">Less Than 20g Carbs</option>
                                    <option value="50">Less Than 50g Carbs</option>
                                </select> 

                                <h3 className="filterCategoryHeader">Filter By Calories</h3>
                                <select name="Calories" className="Calories"onChange={(e)=>{
                                    this.state.calorieOption = e.target.value 
                                }}>
                                    <option value="null">---</option>
                                    <option value="300">Less Than 300 Calories</option>
                                    <option value="400">Less Than 400 Calories</option>
                                    <option value="500">Less Than 500 Calories</option>
                                    <option value="600">Less Than 600 Calories</option>
                                    <option value="700">Less Than 700 Calories</option>
                                </select>
                                <button className="applyFilters" onClick={this.applyFilterMenu}>Apply Filters</button>

                            </div>
                        )
                        : (
                            null
                        )
                    }
                    
            </div>

        );
    };

}

export default FilterMenu;