const express = require('express');
const router = express.Router();
const path = process.cwd();
const db = require(path + '/backend/db/db.js');
// const conn = db.init();
const QueryHandler = require('./queryHandler');
const FindPopularResults = require('./findPopularResults');
const HealthScore = require('./healthScore');
const fs = require('fs');

const confFile = fs.readFileSync('config/config.json', 'utf8');
const config = JSON.parse(confFile);

router.post('/result/:id', (req, res) => {
	console.log('!!!!!!!!!!!')
	recipeId = req['body']['id']
	console.log(recipeId)
	console.log('THIS IS ID SERVER',req["body"]["path"])
	Query_URL = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeId}/information`;

	var req = unirest("GET", Query_URL);

	req.headers({
		"x-rapidapi-key": config.api.key,
		"x-rapidapi-host": config.api.host,
		"useQueryString": true
	});

	req.end(function (res) {
		if (res.error) throw new Error(res.error);


		obj = res.body

		sendResult(obj)
	});

	function sendResult(recipes) {
		//console.log(recipes)

		// Query result is empty
		if (recipes === null)
			return null;

		res.send(JSON.stringify(recipes))
	}
})
router.get('/getPopular', (req, res) => {
	console.log('im here in getPopular')
	popularResultsHandler.getResults(conn)
		.then(obj => {
			console.log('i got the objjj: ', obj)
			res.send(JSON.stringify(obj))
		})

})

router.post('/autocomplete', (req, res) => {
	console.log('AutoComplete POST')
	console.log('reqesttt', req.body.data)
	var theKey = 'king'
	var typeKey = 'type'
	var queryKey = 'query'
	req.body.data = JSON.parse(req.body.data)

	queryHandlerResult = queryHandler.handleAutoQuery(req.body.data[typeKey], req.body.data[queryKey]) // Call function from back-end/queryHandler.js to get routerropriate query and queryURL
	query = queryHandlerResult[0];
	Query_URL = queryHandlerResult[1];

	res.end('AutoComplete Result Done')
})

router.get('/autocomplete', limiterAutoComplete, (req, res) => {
	console.log('Autocomplete GET')
	console.log('URL:', Query_URL)
	console.log('QUERY:', query)
	var requ = unirest("GET", Query_URL);
	requ.query(query);

	requ.headers({
		"x-rapidapi-key": config.api.key, //Insert your API key here
		"x-rapidapi-host": config.api.host,
		"useQueryString": true
	});

	requ.end(function (res) {
		if (res.error) throw new Error(res.error)
		autoWords = res.body
		sendResult(autoWords)
	})

	function sendResult(autoWords) {
		console.log(autoWords)

		// Query result is empty
		if (autoWords === null)
			return null;

		// Set default result for recipe results
		// Reformat for ingredients and both results
		res.send(JSON.stringify(autoWords))
	}

})

router.post('/recipes', (req, res) => {
	console.log('the real req', req.body.body)
	req.body.body = JSON.parse(req.body.body)
	console.log('THIS IS REQ: ', req['body'].body)
	console.log('Query Type:', req['body'].body.type)
	queryType = req['body'].body.type; // Update type of query (recipe, ingredients, or both)
	queryBody = req['body'].body;

	queryHandlerResult = queryHandler.handleQuery(queryType, queryBody) // Call function from back-end/queryHandler.js to get routerropriate query and queryURL
	query = queryHandlerResult[0];
	Query_URL = queryHandlerResult[1];

	res.end('recieved!')
})



router.get('/recipes', limiterResults, (req, res) => {

	console.log('THIS IS GET: ', Query_URL)
	var requ = unirest("GET", Query_URL);
	console.log('Query:', query)
	requ.query(query);

	requ.headers({
		"x-rapidapi-key": config.api.key, //Insert your API key here
		"x-rapidapi-host": config.api.host,
		"useQueryString": true
	});

	requ.end(function (res) {
		if (res.error) throw new Error(res.error)
		recipes = res.body
		console.log('SERVER!!', recipes)
		// console.log('RECIPES!!', recipes.results)

		recipes = recipes.results
		//Calculate score for each recipe and put in recipe
		recipes.forEach(recipe => {
			score = healthScore.calculateScore(recipe.nutrition.nutrients)
			recipe.score = score
		});
		
		// sort by health score descending 
		recipes.sort(function(a, b) {						
			return b.score - a.score;
		})
		
		console.log('Recipes!!!!', recipes)
		sendResult((recipes))
	})

	function sendResult(recipes) {
		// console.log(recipes)

		// Query result is empty
		if (recipes === null)
			return null;

		// Set default result for recipe results
		let result = recipes.results
		// console.log("SERVER RESULT: ", recipes, result)

		// Reformat for ingredients and both results
		if (result== null) {
			result = recipes;
		}
		console.log('RESULT!!!!', result)
		res.send(result)
	}

})

router.post("/xhr", (req, res, next) => {

	var head = {
		"Content-Type": "text/plain"
	}

	res.writeHead(200, head);

	next();

}, (req, res) => {
	if(req.body["type"] == "ingredients") {
		//This sets up the database
		var prepTime = req.body["prepTimeAmount"] + " " + req.body["prepTimeUnits"];
		var cookTime = req.body["cookTimeAmount"] + " " + req.body["cookTimeUnits"];
		//Create the ingredients json
		var obj = {};
		for(var i = 0; i < req.body["ingredients"].length; i++) {
			obj[i] = req.body["ingredients"][i]; //set up a json object for the ingredients list
		}
		//Create the steps json
		var stps = {};
		for(var  i = 0; i < req.body["steps"].length; i++) {
			stps[i] = req.body["steps"][i]; //set up a json object for the steps list
		}
		//Make a json object for images
		var imgs = {};
		for(var i = 0; i < req.body["images"].length; i++) {
			imgs[i] = req.body["images"][i];
		}
		
		imageDB.testingPromise(req.body["title"], req.body["user"], prepTime, cookTime, req.body["servings"], obj, stps, imgs).then((success)=>{
			res.end("finish");
		}).catch(err=>{
			console.log(err);
		});
	} else {
		fs.mkdir(`./imgs/${req.body["user"]}`, (err)=>{
			if(err) {
				console.log(err);
			}
			//This will save the files to the folder system
			for(const f in req.body) {
				if(f != "type" && f != "user") {
					var pth = `imgs/${req.body["user"]}/${f}`;
					fs.routerendFileSync(pth, req.body[f], {encoding: "base64", mode:0o666});
				}
			}	
		});
		res.end("Done");
	}

});

module.exports = router