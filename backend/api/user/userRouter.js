const express = require('express');
const router = express.Router();
const path = process.cwd();
const db = require(path + '/backend/db/db.js');
// const conn = db.init();
const UserClass = require('./userClass');
const user = new UserClass();

// signup
router.post("/signup", (req, res) => {
	//console.log(req.body.username);
	user.addUser(req.body.username, req.body.password, req.body.email, req.body.fName, req.body.lName)
		.then(function (result) {
            
			res.status(200).json({"Messages":"user created successfully"});
            console.log(JSON.stringify({"ReqURL": req.baseUrl, "ReqBody": req.body, "ResCode": res.statusCode, "ResMessage": res.body}))
		})
		.catch(function (err) {
			res.status(402).json(err);
            console.log(JSON.stringify({"ReqURL": req.baseUrl, "ReqBody": req.body, "ResCode": res.statusCode, "ResMessage": res.body}))
        })
});

//Handle a login request
router.post("/login", (req, res) => {
    if(!req.body.username || !req.body.password) {
        res.status(402).json(err);
        console.log(JSON.stringify({"ReqURL": req.baseUrl, "ReqBody": req.body, "ResCode": res.statusCode, "ResMessage": res.body}))
        return
    }

    user.checkUsernameAndPassword(req.body.username, req.body.password)
        .then(function (result) {
            if (!result) return res.status(400).end();
            else {
                
                res.cookie('FTY_SES', result.username, {maxAge:1000, httpOnly:true, Secure: true});
                res.status(200).json(result); //This will just end the call
                console.log(JSON.stringify({"ReqURL": req.baseUrl, "ReqBody": req.body, "ResCode": res.statusCode, "ResMessage": res.body}))
            }
        })
        .catch(function (err) {
            res.status(401).json("internal error");
            console.log(JSON.stringify({"ReqURL": req.baseUrl, "ReqBody": req.body, "ResCode": res.statusCode, "ResMessage": res.body}))
        })
});

// get a user info
router.get("/get", (req, res) => {
    if(!req.body.username || !req.body.password) {
        res.status(401).json(err);
        console.log(JSON.stringify({"ReqURL": req.baseUrl, "ReqBody": req.body, "ResCode": res.statusCode, "ResMessage": res.body}))
    }

    user.checkUsernameAndPassword(req.body.username, req.body.password)
        .then(function (result) {
            if (!result) res.status(400).end();
            else {
                res.status(200).json(result); //This will just end the call
                console.log(JSON.stringify({"ReqURL": req.baseUrl, "ReqBody": req.body, "ResCode": res.statusCode, "ResMessage": res.body}))
            }
        })
        .catch(function (err) {
            res.status(401).json(err);
            console.log(JSON.stringify({"ReqURL": req.baseUrl, "ReqBody": req.body, "ResCode": res.statusCode, "ResMessage": res.body}))
        })
});

// logout
router.get("/logout", (req, res) => {
    let username = req.session.username;
    req.session.destroy(err => {
        if (err) throw err;
        console.log(username + " log out");
        res.end();
    });
});

// check username or email dup 
router.post("/dupChecker", (req, res) => {
    user.checkUsernameEmailDuplicate(req.body.value, req.body.type)
        .then(function (result) {
            res.status(200).end("No dup value exist");
        })
        .catch(function (err) {
            res.status(405).end("duplicate found.");
        })
})

// change password
router.post("/passwd", (req, res) => {
    //console.log(req.body);
    user.changePassword(req.body.username, req.body.currentPassword, req.body.newPassword)
        .then(result => {
            res.status(200).send(JSON.stringify(result));
        })
        .catch(err => {
            res.status(403).send(JSON.stringify(err));
        })
});

module.exports = router