const { response } = require('express');
const express = require('express');
const router = express.Router();
var unirest = require("unirest");
const fs = require('fs');

const confFile = fs.readFileSync('config/config.json', 'utf8');
const config = JSON.parse(confFile);

/**
 * @FindPopularResults class : Takes the SQL connection variable and finds the top rated recipes to display on the homepage
 * @param : connection of the SQL server
 */

class FindPopularResults {

    popularRecipes = []
    numOfRecipes = null
    cachedData = null // simple in memory cache, can be transfered to DB! 
    cacheTime = 0

    /**
     * @constructor : sets default number of recipes in which we want to find
     */
    constructor() {
        // please do not change this if you are not testing it!
        this.numOfRecipes = 5; 
    }


    getResults(conn) {
        return new Promise((resolve, reject) => {
            try{
        if (this.cacheTime && (this.cacheTime >  Date.now() - 3600 * 10000)){
                    console.log('Using Cached Data!')
                    return resolve(this.cachedData)                    
            }
            this.getQueryResult(conn)
                .then(records => {
                    var rec = records
                    console.log('this is rec', rec)
                    for (var i = 0; i < records.length; i++) {
                        this.callApi(records[i]['url'], records[i]['recipeNo'])
                            .then(recipe => {
                                this.popularRecipes.push(recipe)
                                if (this.numOfRecipes === this.popularRecipes.length){
                                    this.cachedData = this.popularRecipes
                                    console.log('Updating Cache!')
                                    this.cacheTime = Date.now()
                                    resolve(this.popularRecipes)
                                }
                            })
                            .catch(error => console.log("an error has occured calling API (findPopularResults)", error))
                    }
                })
                .catch(error => console.log("an error has occured calling API (getQueryResult)", error))
            }
            catch(e){
                reject(e)
            }
        })
    }

    /**
     * @callApi function: uses the extract API to extract recipes using URL 
     * @returns : promise object
     */
    callApi(url, id) {
        return new Promise((resolve, reject) => {
            //the cache refreshes every 1 hour!  
            try {
                
            unirest
                .get('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/extract')
                .headers({
                  "x-rapidapi-key": config.api.key, //Insert your API key here
                    "x-rapidapi-host": config.api.host,
                    "useQueryString": true
                })
                .query({ "url": url })
                .end(function (result) {
                    var recipes = { 'title': null, 'image': null }
                    if (result.error) throw new Error(result.error);
                    recipes['title'] = result.body['title']
                    recipes['image'] = result.body['image']
                    recipes['id'] = -id
                    recipes['sourceUrl'] = result.body['sourceUrl']
                    recipes['sourceName'] = result.body['sourceName']
                    recipes['readyInMinutes'] = result.body['readyInMinutes']
                    recipes['instructions'] = result.body['instructions']
                    recipes['ingredients'] = result.body['extendedIngredients']
                    recipes['serving'] = result.body['servings']
                    recipes['aggregateLikes'] = result.body['aggregateLikes']
                    return resolve(recipes)
                });

                this.cacheTime = Date.now()
            }
            catch(e){
                reject(e)
            }
        })
    
    }

    

    /**
     * @getQueryResult function:returns numOfRecipes popular recipes from the database  
     * @returns : promise object
     */
    getQueryResult(conn) {
        return new Promise((resolve, reject) => {
            var sql = `SELECT url, recipeNo from recipe where liked >= 1 ORDER BY RAND() LIMIT ${this.numOfRecipes}`

            conn.query(sql, function (err, results) {
                if (err) {
                    return reject('Error couldnt find the popular recipes!')
                }
                else {
                    console.log('Recived Popular Recipes Records: ', results)
                    conn.end()
                    return resolve(results)
                }
            })
        })
    }
}


module.exports = FindPopularResults;