const { query } = require("express")

/**
 * @QueryHandler class : Takes query type and request body to set up and return appropriate query 
 */
class QueryHandler {
    // Variable Declarations
    API_URL = null 
    recipeURL = null
    ingredientsURL = null
    bothURL = null
    recipeIdURL = null
    recipeAutoURL = null
    ingredientsAutoURL = null
    nutritionURL = null

    Query_URL = null
    query = null

    /**
     * @constructor : sets default API URL, add-ons for each recipe, ingredients, and both URL
     */
    constructor(){
        this.API_URL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/" // Base Spoonacular API address
        this.recipeURL = "complexSearch" // Add-On URL for recipe
        this.ingredientsURL = "complexSearch" // Add-On URL for ingredients
        this.bothURL =  "complexSearch" // Add-On URL for both
        this.recipeAutoURL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/autocomplete" // Add-On URL for recipe
        this.ingredientsAutoURL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/autocomplete" // Add-On URL for ingredients
        this.recipeIdURL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/informationBulk"
        this.nutritionURL = "/nutritionWidget.json"
    }

   /**
    * @handleQuery : Checks which query to call, then set query and queryURL to match those.
    * @param {String} queryType : type of query is passed to check in string 
    * @param {JSON} body : body of request is passed which contains either "query" or "ingredients" or both
    * @returns : (Query and QueryURL) or null if not a valid request 
    */
    handleQuery(queryType, body){
        // Query type for searching only "recipe"
        console.log(queryType, body)
        if(queryType === "recipe"){
            this.setQueryURL(this.recipeURL)
            this.setRecipeQuery(body['query'])
        }
        // Query type for searching only "ingredients"
        else if(queryType === "ingredients"){            
            this.setQueryURL(this.ingredientsURL)
            var include= []
            var exclude = []
            body['ingredients'].map((ingredient) =>{
                console.log('getting this ing: ', ingredient)
                ingredient[1] == "add" ? include.push(ingredient[0]) : exclude.push(ingredient[0]) 
            })
            this.setIngredientsQuery(include, exclude) // Exclude Ingredients    
        }
        // Query type for searching for "both"
        else if(queryType === "both"){
            this.setQueryURL(this.bothURL)
            this.setBothQuery(body['query'], body['ingredients'], []) // Exclude Ingredients
        }
        // Otherwise, not a valid entry
        else{
            return null
        }

        // Return query and queryURL
        return [this.getQuery(), this.getQueryURL()]
    }

    /**
     * @handleAutoQuery : Check queryType and queryName and return queryURL and updated query
     * @param {String} queryType recipe or ingredients 
     * @param {String} queryName queryName
     * @returns list of query and queryURL
     */
    handleAutoQuery(queryType, queryName) {
        this.setAutoQuery(queryName)
        if(queryType === 'recipe') {            
            this.setAutoQueryURL(this.recipeAutoURL)
        } else {
            this.setAutoQueryURL(this.ingredientsAutoURL)
        }

        return [this.getQuery(), this.getQueryURL()]
    }
    
    /**
     * @handleAutoQuery : Set queryID URL and Query and return 
     * @param {String} Ids : Comma separated recipe ids in string
     * @returns list of query and queryURL
     */
    handleIDQuery(Ids) {
        this.setIDQuery(Ids)
        this.setIDQueryURL(this.recipeIdURL)
        return [this.getQuery(), this.getQueryURL()]
    }

    handleNutritionQuery(ID) {
        console.log(this.getNutritionQuery(ID))
        return this.getNutritionQuery(ID)
    }

    /**
     * @setQueryURL : sets query URL by appending ExtraURL after API_URL
     * @param {String} ExtraURL : ExtraURL to be appened after main API URL
     */
    setQueryURL(ExtraURL){
        this.Query_URL = this.API_URL + ExtraURL;
    }
    
    /**
     * @setAutoQueryURL : set queryURL
     * @param {String} URL 
     */
    setAutoQueryURL(URL) {
        this.Query_URL = URL;        
    }

    /**
     * @setIDQueryURL : set queryIDURL
     * @param {String} URL 
     */
    setIDQueryURL(URL) {
        this.Query_URL = URL;
    }
    /**
     * @setRecipeQuery : constructs query for recipe query
     * @param {String} queryName : name of recipe is passed
     */
    setRecipeQuery(queryName){
        this.query = {
            "query": queryName,
            "number": 20,
            "offset": 0,
            "minCalories": 0,
            "minFat": 0,
            "minCarbs": 0,
            "minProtein": 0,
            "minSaturatedFat": 0,
            "minSugar": 0,
            "minSodium": 0,
            "minFiber": 0,
            "ranking" : 2
        }
    }
    
    /**
     * @setIngredientsQuery : constructs query for ingredients query
     * @param {List of Strings} ingredients : list of ingredients is passed
     */
    setIngredientsQuery(include, exclude){
        
        this.query = {
            "includeIngredients": include.toString(),
            "excludeIngredients": exclude.toString(),
            "number": 10,
            "offset": 0,
            "minCalories": 0,
            "minFat": 0,
            "minCarbs": 0,
            "minProtein": 0,
            "minSaturatedFat": 0,
            "minSugar": 0,
            "minSodium": 0,
            "minFiber": 0,
            "ranking" : 2
        }
    }
    
    /**
     * @setBothQuery : constructs query for both recipe and ingredients
     * @param {String} queryName name of recipe is passed
     * @param {List of Strings} ingredients list of ingredients is passed
     */
    setBothQuery(queryName, include, exclude = []){
        this.query = {
            "number": 10,
            "query": queryName,
            "includeIngredients": include.toString(),
            "excludeIngredients": exclude.toString(),
            "offset": 0,
            "minCalories": 0,
            "minFat": 0,
            "minCarbs": 0,
            "minProtein": 0,
            "minSaturatedFat": 0,
            "minSugar": 0,
            "minSodium": 0,
            "minFiber": 0,
            "ranking" : 2
        }
    }

    /**
     * @setAutoQuery : set query using queryName and default number of 5 results
     * @param {String} queryName 
     */
    setAutoQuery(queryName){
        this.query = {
            "query": queryName,
            "number": 5
        }
    }

    /**
     * @setIDQuery : set query using recipe IDs 
     * @param {String} Id : comma separated recipe ids
     */
    setIDQuery(Id){
        this.query = {
            "ids": Id        
        }
    }

    getNutritionQuery(Id){
        return this.API_URL + Id + this.nutritionURL
    }
    /**
     * @getQuery : returns current query 
     * @returns : latest query generated
     */
    getQuery(){
        return this.query;
    }

    /**
     * @getQueryURL : returns current queryURL
     * @returns : latest queryURL generated
     */
    getQueryURL(){
        return this.Query_URL;
    }


};

module.exports = QueryHandler