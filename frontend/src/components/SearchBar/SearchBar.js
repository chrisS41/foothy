import React, { Component, useRef } from 'react';
import styles from './SearchBar.module.css';
import logo from '../../pages/img/Logo1000.png';
import { Redirect } from 'react-router';
import CarouselItem from '../RecipeCarousel'
import Carousel from "react-elastic-carousel"
import ClipLoader from "react-spinners/BeatLoader";
import ClipLoaderCookBook from "react-spinners/PropagateLoader";
import { css } from "@emotion/core";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa"
import { FaPlus } from "react-icons/fa"
import { FaMinus } from "react-icons/fa"
import { GrClose } from "react-icons/gr";
import { IconContext } from "react-icons";
import "./Carousel.css"
import { Link } from 'react-router-dom';
import axios from 'axios';
//import improvedFunctions from '../../../../sandbox/improvedFunctions';
// import { query } from 'express';
import config from "./../../config/config.json"

const override = css`
  display: block;
`;

const ModalContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #E9E9E9;
  z-index: 1;
`;

const DELAY_AFTER_ANIMATION = 1000;

const SearchPlaceHolders = [
    "Search by your favorite ingredient",
    "Search by your favorite diet",
    "Search by your favorite cuisine",
]

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipes: [],
            ingredients: [],
            popularloading: true,
            cookBookLoading: false,
            search_query: null,
            popularRecipes: null,
            ingredientMode: false,
            redirect: false,
            headerCookBook: null,
            suggestions: [],
            display: false,
            _isMounted: false
        }
        this.myRef = React.createRef();
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.renderAutocomplete = this.renderAutocomplete.bind(this);
        this.switchListener = ()=>{
            if(window.innerWidth <= 450) {
                document.getElementById("swbrClick").style.width = "50px";
                document.getElementById("swbrInClick").style.width = "100px";
                if(this.state.ingredientMode == false) {
                    document.getElementById("swbrInClick").style.marginLeft = "0px";
                    document.getElementById("switch-ball").style.right = "2.5px";
                } else {
                    document.getElementById("swbrInClick").style.marginLeft = "-50px";
                    document.getElementById("switch-ball").style.right = "22.5px";
                }
            } else {
                document.getElementById("swbrInClick").style.width = "210px";
                if(this.state.ingredientMode == false) {
                    document.getElementById("swbrClick").style.width = "90px";
                    document.getElementById("swbrInClick").style.marginLeft = "0px";
                    document.getElementById("switch-ball").style.right = "2.5px"
                } else {
                    document.getElementById("swbrClick").style.width = "120px";
                    document.getElementById("swbrInClick").style.marginLeft = "-90px";
                    document.getElementById("switch-ball").style.right = "92.5px";
                }
            }
        }
        this.mouseListener = (event) => {
            const { current: wrap } = this.myRef;
            if (wrap && !wrap.contains(event.target)) {
              this.setState({display:false});
            }
        }
    }


    componentDidMount() {
        this.state._isMounted = true;
        window.addEventListener("resize", this.switchListener);
        window.addEventListener("mousedown",this.mouseListener );
        this.getPopularRecipe();
    }

    componentWillUnmount(){
        this.state._isMounted = false;
        window.removeEventListener("resize", this.switchListener);
        window.addEventListener("mousedown",this.mouseListener );
    }

    // Request options for recipe
    requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { type: 'recipe', query: null },
    }

    // Request options for ingredients
    requestIngredients = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { type: 'ingredients', ingredients: null }
    }

    // Request options for both
    requestRecipeWithIngredients = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { type: 'both', query: null, ingredients: null }
    }

    requestPopularRecipes = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }

    // Request options for recipe autocomplete
    requestRecipeAutoComplete = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: { type: 'recipe', query: null},
        mode: 'cors'
    }

    // Request options for ingredients autocomplete
    requestIngredientsAutoComplete = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: { type: 'ingredient', query: null},
        mode: 'cors'
    }

    /**
     * @pickQuery : Finds and returns appropriate query to call API when search button is clicked.
     *              Selections are 1. Recipe name
     *                             2. Ingredients only
     *                             3. Recipe name + Ingredients
     * @returns query or null if not a valid entry
     */
    pickQuery() {
        let searchQuery = this.state.search_query; // Get inputs from search bar 
        let queryExists = searchQuery !== null && searchQuery !== ""; // Check for valid input
        let ingredientExists = this.state.ingredients !== null && this.state.ingredients !== "" && this.state.ingredients.length > 0; // Check if ingredient exists
        let isIngredientMode = this.state.ingredientMode; // Check if ingredient mode
        // Query Selection
        if (isIngredientMode && !queryExists && ingredientExists) {
            console.log('Ingredients Only');
            return this.requestIngredients;
        }
        else if (isIngredientMode && queryExists && ingredientExists) {
            console.log('Query and Ingredients');
            return this.requestRecipeWithIngredients;
        }
        else if (!isIngredientMode && queryExists) {
            console.log('Query Only');
            return this.requestOptions;
        }
        else {
            // No Matching Query
            return null;
        }
    }

    /**
     * @pickAutoQuery : Check and return depending on which mode it is, recipe or ingredients
     * @returns requestQuery
     */
    pickAutoQuery() {
        let isIngredient = this.state.ingredientMode;

        if(isIngredient) {
            return this.requestIngredientsAutoComplete
        } else {
            return this.requestRecipeAutoComplete
        }
        
    }
    /**
     * @updateIngredients : update ingredients state
     * @param {List of Strings} Ingredients : list of latest ingredients
     */
    updateIngredients(Ingredients) {
        this.setState({
            ingredients: Ingredients,
            search_query: ''
        });
    }

    /**
     * @newIngredients : update the ingredients state
     * @ingred : parameter of new items
     */
    newIngredients(ingred) {
        this.setState({
            ingredients: ingred
        });
    }

    /**
     * @clearSearchBar : clears visually texts in search bar 
     */
    clearSearchBar() {
        // Clear visually left texts on search bar
        Array.from(document.querySelectorAll('input')).forEach(
            input => {
                if (input.name === "search_query")
                    input.value = ''
            }
        )
    }

    /**
     * @todo update recipe request
     */
    updateRecipeRequest() {

    }
    /**
     * @getPopularRecipe : gets the top 7 recipes of the week
     */
    getPopularRecipe = async () => {
        // Pass request and get result, update recipes and redirect
        // try {
        //     fetch('/getPopular', this.requestPopularRecipes)
        //         .then(res => res.json())
        //         .then(recipes => {
        //             this.setState({ popularRecipes: recipes, popularloading: false }, () => {
        //                 console.log('popular recipes request recived: ', recipes)
        //             })
        //         })
        // } catch (e) {
        //     console.log(e)
        // }
        console.log('front end get pop ')
        try {
           await axios.get(config.BE.Addr + '/getPopular', null,
           {
               mode: "cors",
               headers: { 'Content-Type': 'application/json' }
           })
                .then(recipes => {
                    this.setState({ popularRecipes: recipes.data, popularloading: false }, () => {
                        console.log('popular recipes request recived: ', recipes)
                    })
                })
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * @getAutocompleteResults :update POST request, check for empty query, pick Autoquery (recipe or ingredients), and get result
     * @param {event Object} event 
     * @returns 
     */
    getAutocompleteResults = async (event) => {
        if (event.target.value === "" || event.target.value === null)
            return;
        
        this.updateIngredientsAutoRequest(event.target.value);
        this.updateRecipeAutoRequest(event.target.value);
        let query = this.pickAutoQuery()

        // console.log(query);

        // 1. Call POST to setup query and queryURL
        // 2. Call GET to call API and get results
        try {
            console.log('auto complete here!!!')
            delete query.url
            await axios.post(config.BE.Addr + '/autocomplete', query)
            await axios.get(config.BE.Addr + '/autocomplete')
                .then(autoWords => {
                    console.log('autowords', autoWords.data)
                    this.setState({ display: true, suggestions: autoWords.data }, () => {
                    console.log('autocomplete words received: ', autoWords.data)
                    })
                })
        } catch (e) {
            console.log(e)
        }

    }
    /**
     * @updateIngredientReuqest : update ingredient request with latest data
     * @param {List of Strings} Ingredients 
     */
    updateIngredientsRequest(Ingredients) {
        this.requestIngredients['body'] = JSON.stringify({ 'type': 'ingredients', 'ingredients': Ingredients });
    }

    /**
     * @updateBothRequest : update "both" request with latest data
     * @param {List of Strings} Ingredients 
     */
    updateBothRequest(Ingredients) {
        this.requestRecipeWithIngredients['body'] = JSON.stringify({ 'type': 'both', 'query': this.state.search_query, 'ingredients': Ingredients });
    }

    /**
     * @updateRecipeAutoRequest : update recipe autocomplete request
     * @param {String} queryName : name of query
     */
    updateRecipeAutoRequest(queryName) {
        this.requestRecipeAutoComplete['data'] = JSON.stringify({'type': 'recipe', 'query': queryName})
    }

        /**
     * @updateIngredientsAutoRequest : update ingredients autocomplete request
     * @param {String} queryName : name of query
     */
    updateIngredientsAutoRequest(queryName) {
        this.requestIngredientsAutoComplete['data'] = JSON.stringify({'type': 'ingredient', 'query': queryName})
    }

    /**
     * @keyPress : will detect if the user presses enter, '+' (to add ingredients)
     * @param {event} e event when keys get pressed  
     */
    keyPress = (e) => {
        if (e.key === 'Enter') { //enter
            return this.handleButtonClick();
        }
        if (e.key === '+') {  // will switch the mode to ingredient 
            e.preventDefault();
            this.state.ingredientMode = true
            return this.handleAddIngredient();
        }
    }

    /**
     * @handleButtonClick : handler for search button picks appropriate query, then fetch recipes by calling API
     * @param {event} event 
     * @returns list of recipes or null if result is empty
     */
    handleButtonClick = async () => {        
        this.setState({ cookBookLoading: true, suggestions: [] })
        console.log(this.requestOptions['body'])

        // Call pickQuery to set request options
        let query = this.pickQuery();

        if (query === null) {
            console.log('No Match');
            /**
             *  @todo: // Pop up 'Invalid Input' implementation needed
             */

            return;
        }

        this.setState({ headerCookBook: query })

        // Pass request and get result, update recipes and redirect
        try {
            // query.url = config.BE.Addr + '/recipes'
            console.log('it gets here')
            query.data = JSON.stringify(query)
            query.mode = "cors"
            delete query.body
            console.log('sending this query: ', query)
            let result = await axios(config.BE.Addr + '/recipes', query)
            console.log(result)
            axios.get(config.BE.Addr + '/recipes', null, {
                headers: {'Content-Type': 'application/json'},
                mode: "cors"
            } )
                .then(result => {
                    console.log("HERERERE", result.data)
                    this.setState({recipes: result.data, redirect: true, cookBookLoading: false }, () => {
                        console.log('request recived: ', result.data)
                    })
                }).catch( (err) => {console.log(err)})
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * @handleInputChange : handler for whenever a character is typed
     * @param {event} event 
     */
    handleInputChange = async (event) => {
        // console.log(event.target.name)

        this.requestOptions['body'] = JSON.stringify({ 'type': 'recipe', 'query': event.target.value });
        this.requestRecipeWithIngredients['body'] = JSON.stringify({ 'type': 'both', 'query': event.target.value, 'ingredients': this.state.ingredients });

        const value = event.target.value;
        if(value.length <= 1)
            this.setState(() => ({
                suggestions: [],
            }))
        else         
            await this.getAutocompleteResults(event)

        this.setState({
            search_query: event.target.value            
        })
        
    }

    handleMode = (event) => {

        if (event.target.value === "ingredients") {
            this.setState({
                ingredientMode: true,
                suggestions: []
            })
        } else if (event.target.value === "recipe") {
            this.setState({
                // ingredients: [],
                ingredientMode: false,
                suggestions: []
            })
        }

        // console.log(event.target.value)
    }

    /**
     * @handleAddIngredient : handler for add ingredient button, update data and requests
     * @param: obj - the mode of the ingredient (add/exclude)
     */
    handleAddIngredient = (obj) => {
        if (this.state.search_query === "" || this.state.search_query === null)
            return;

        //Stop this from happening, because we don't want repeats
        for(var i = 0; i < this.state.ingredients.length; i++) {
            if(this.state.search_query == this.state.ingredients[i][0]) {
                this.clearSearchBar();
                return;
            }
        }
        let temp = [this.state.search_query, obj]
        let updated_ingredients = [...this.state.ingredients, temp];
        this.updateIngredients(updated_ingredients)
        this.updateIngredientsRequest(updated_ingredients)
        this.updateBothRequest(updated_ingredients)

        this.clearSearchBar()
    }

    clickSwitch = (e) => {
        //This is for moving the switch bar on the search bar
        if(!this.state.ingredientMode) {   
            if(window.innerWidth > 450) {
                document.getElementById("swbrClick").style.width = "120px";
                document.getElementById("swbrInClick").style.marginLeft = "-90px";
                document.getElementById("switch-ball").style.right = "92.5px";
            } else {
                
                document.getElementById("swbrInClick").style.marginLeft = "-50px";
                document.getElementById("switch-ball").style.right = "22.5px";
            }
            //e.target.style.right = "127.5px";
            this.setState({
                ingredientMode: true
            });

        } else {
            if(window.innerWidth > 450) {
                document.getElementById("swbrClick").style.width = "90px";
                document.getElementById("swbrInClick").style.marginLeft = "0px";  
                document.getElementById("switch-ball").style.right = "2.5px";
            } else {
                document.getElementById("swbrInClick").style.marginLeft = "0px";
                document.getElementById("switch-ball").style.right = "2.5px";
            }
            //e.target.style.right = "2.5px";
            this.setState({
                ingredients: [],
                ingredientMode: false
            });
        }
    }

    removeItem(e) {
        var block = document.getElementById("ingredientListTest");
        for(var i = 0; i < block.childNodes.length; i++) {
            if(block.childNodes[i].getAttribute("id") == e) {
                var newI = this.state.ingredients.filter(ind=> e != ind[0]);
                this.newIngredients(newI);
                break;
            }
        }
    }

    autoCompleteSelected (value) {
        this.setState({display: false})
        this.requestOptions['body'] = JSON.stringify({ 'type': 'recipe', 'query': value });
        this.requestRecipeWithIngredients['body'] = JSON.stringify({ 'type': 'both', 'query': value, 'ingredients': this.state.ingredients });
        console.log("value111", value)
        Array.from(document.querySelectorAll('input')).forEach(
            input => {
                if (input.name === "search_query") {
                    input.value = value                    
                }
            }
        )

        this.setState(() => ({
            search_query: value,
            suggestions: []
        }), () => console.log(this.state.search_query))
    }

    //Fix this next
    renderList() {
        return (
            //this.state.ingredients.map(ingredient => <div className={styles.ingredientItem} id={ingredient}>{ingredient}<IconContext.Provider value={{ color: "blue", className: "global-class-name" }}><div className={styles.closeIcon} onClick={()=>{this.removeItem(ingredient)}}><GrClose size="15"/></div></IconContext.Provider></div>)
            this.state.ingredients.map((ingredient)=>
                <div className={ingredient[1] == "add" ?styles.ingredientItem: styles.ingredientItemRemove} key={ingredient[0]} id={ingredient[0]}>
                    
                    {ingredient[0]}

                    <IconContext.Provider value={{ color: "white"}}>
                        <div className={styles.test} onClick={()=>{this.removeItem(ingredient[0])}}>
                            <FaPlus size="15"/>
                        </div>
                    </IconContext.Provider>

                </div>
            )
        );
    }

    renderAutocomplete() {
        return (
            <div ref={this.myRef} className={styles.searchBox}>
                {this.state._isMounted?
                <ul id={this.state.ingredientMode? null: styles.recipeSug}>
                    {this.state.suggestions.map((sugg)=> <li key={this.state.ingredientMode ? sugg.name :sugg.title} onClick={() => this.autoCompleteSelected(this.state.ingredientMode ? sugg.name :sugg.title)}>{this.state.ingredientMode ? sugg.name :sugg.title}</li>)}
                </ul>: null}
            </div>
        );
    }
    /**
     * @preventDragHandler : handler for  drags
     */
    preventDragHandler = (e) => {
        e.preventDefault();
    }


    render() {
        const { redirect } = this.state
        const { recipes } = this.state
        const { headerCookBook } = this.state
        if (redirect) {
            return <Redirect to={{
                pathname: '/cookbook',
                state: { id: recipes,
                        typeOfQuery: headerCookBook.body }
            }}
            />
        }

        /* Radio Button Code
            --Home
             <div className={styles.modeSelect} >Search by:
                            <input onClick={this.handleMode} defaultChecked type="radio" id="recipeMode" name="searchMode" value="recipe" />
                            <label htmlFor="recipe">Recipe</label>
                            <input onClick={this.handleMode} type="radio" id="ingredientMode" name="searchMode" value="ingredients" />
                            <label htmlFor="ingredients">Ingredients</label>
                        </div>

            --Result
            <div className={styles.modeSelect} >Search by:
                            <input onClick={this.handleMode} defaultChecked type="radio" id="recipeMode" name="searchMode" value="recipe" />
                            <label htmlFor="recipe">Recipe</label>
                            <input onClick={this.handleMode} type="radio" id="ingredientMode" name="searchMode" value="ingredients" />
                            <label htmlFor="ingredients">Ingredients</label>
                        </div>
        */
        const breakPoints = [
            { width: 1, itemsToShow: 1 },
            { width: 400, itemsToShow: 2 },
            { width: 550, itemsToShow: 3 },
            { width: 768, itemsToShow: 4 },
            { width: 1200, itemsToShow: 5 },
            { width: 1300, itemsToShow: 5 }
        ]
        return (
            <main>

                {this.props.page === "homePage" ?

                    <div id="homePageVersion">

                        <div id={styles.logoDisplay}>
                            <a href="/"><img src={logo} alt="foothy_logo_01" /></a>
                        </div>

                        {/* waiting for the request */}
                        {this.state.cookBookLoading ?
                            <ModalContainer>
                                <div id={styles.sweetLoadingCookBook}>
                                    <ClipLoaderCookBook css={override} size={15} color={"#095c3c"} loading={this.state.cookBookLoading} />
                                </div>
                            </ModalContainer>
                            : null}


                       

                        <div className={styles.swbr} onClick={this.clickSwitch} id="swbrClick">
                            <div className={styles.inSwbr} id="swbrInClick">

                                <div className={styles.recipeTag}>

                                    <p>Recipe</p>

                                </div>

                                <div className={styles.ingredientsTag}>

                                    <p>Ingredients</p>

                                </div>

                            </div>
                            <div className={styles.switchButton} id="switch-ball"></div>
                        </div>

                        <div className={styles.searchBox} >
                            <input type="text" autoComplete="off" placeholder={this.state.ingredientMode ? "Search Ingredient..." : "Search Recipe..."} name="search_query" onChange={this.handleInputChange} onKeyDown={this.keyPress} />
                            {this.state.ingredientMode ? <div className={styles.tooltip}><span className={styles.tooltiptext}>Add Ingredient</span><button className={styles.addButton} type="button" value="add" onClick={() => { this.handleAddIngredient('add') }}><FaPlus size="15" /></button></div> : null}
                            {this.state.ingredientMode ? <div className={styles.tooltip}><span className={styles.tooltiptext} id={styles.exclude}>Exclude Ingredient</span><button className={styles.removeButton} type="button" value="exclude" onClick={() => { this.handleAddIngredient('exclude') }}><FaMinus size="15" /></button></div> : null}
                        </div>
                        {this.state.display ? this.renderAutocomplete() : null}


                        <div className={styles.container} id="ingredientListTest">
                            {this.state.ingredientMode ? this.renderList() : null}
                        </div>

                        {/* {this.state.recipes.map(recipe =>
                            <div key={recipe.id}> {recipe.title}</div>)} */}



                        <div id={styles.searchButton}>
                            <button type="submit" onClick={this.handleButtonClick}>Search</button>
                        </div>
                        <div className={styles.resultRowsCarousel} onDragStart={this.preventDragHandler}>
                            <div id={styles.sweetLoading}>
                                <ClipLoader css={override} size={15} color={"#063D28"} loading={this.state.popularloading} />
                            </div>
                            {this.state.popularRecipes ? (

                                <Carousel breakPoints={breakPoints} >

                                    {this.state.popularRecipes.map(recipe =>  <CarouselItem recipe={recipe} key={recipe.id} title={recipe.title} image={recipe.image} />)}

                                    {/* <CarouselItem title="Fried Rice" image="https://media.istockphoto.com/photos/chicken-fried-rice-picture-id945606006?k=6&m=945606006&s=612x612&w=0&h=fZWJklaZpqhcVFU7v8Tc2d0S9OQu0pU9tvk9NxCira4=" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                                <CarouselItem title="New York Style Cheese Pizza" image="https://cdn.pixabay.com/photo/2017/12/05/20/09/pizza-3000274_960_720.jpg" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                                <CarouselItem title="Fried Chicken with dipping Sauce" image="https://cdn.pixabay.com/photo/2017/09/03/01/17/wings-2709068_960_720.jpg" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                                <CarouselItem title="Fried Rice" image="https://media.istockphoto.com/photos/chicken-fried-rice-picture-id945606006?k=6&m=945606006&s=612x612&w=0&h=fZWJklaZpqhcVFU7v8Tc2d0S9OQu0pU9tvk9NxCira4=" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                                <CarouselItem title="New York Style Cheese Pizza" image="https://cdn.pixabay.com/photo/2017/12/05/20/09/pizza-3000274_960_720.jpg" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} />
                                <CarouselItem title="Fried Chicken with dipping Sauce" image="https://cdn.pixabay.com/photo/2017/09/03/01/17/wings-2709068_960_720.jpg" tags={["Temp1", "Temp2", "Temp3", "Temp4", "Temp5"]} /> */}
                                </Carousel>
                            ) : null
                            }
                        </div>
                    </div>

                    : <div id="resultsVersion">



                        <div className={styles.swbr} onClick={this.clickSwitch} id="swbrClick">
                            <div className={styles.inSwbr} id="swbrInClick">

                                <div className={styles.recipeTag}>

                                    <p>Recipe</p>

                                </div>

                                <div className={styles.ingredientsTag}>

                                    <p>Ingredients</p>

                                </div>

                            </div>
                            <div className={styles.switchButton} id="switch-ball"></div>
                        </div>

                        <div className={styles.searchBox} >
                            <input type="text" placeholder={this.state.ingredientMode ? "Search Ingredient..." : "Search Recipe..."} name="search_query" onChange={this.handleInputChange} onKeyDown={this.keyPress} />
                            {this.state.ingredientMode ? <div className={styles.tooltip}><span className={styles.tooltiptext}>Add Ingredient</span><button className={styles.addButton} type="button" onClick={() => { this.handleAddIngredient() }}><FaPlus size="15" /></button></div> : null}
                        </div>
                        {this.state.suggestions.length ? this.renderAutocomplete() : null}


                        <div className={styles.container} id="ingredientList">
                            {this.state.ingredientMode ? this.renderList() : null}
                        </div>

                        {this.state.recipes.map(recipe =>
                            <div key={recipe.id}> {recipe.title}</div>)}



                        <div id={styles.searchButton}>
                            <button type="submit" onClick={this.handleButtonClick}>Search</button>
                        </div>

                    </div>}


            </main>

        );

    }
}

export default SearchBar;
