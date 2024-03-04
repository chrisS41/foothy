//const mysql = require("mysql");

const path = process.cwd();
const bcrypt = require(path + '/backend/crypt/bcrypt');
const db = require(path + '/backend/db/db');
// const db = db.init();


class UserClass {

    // Adds a user to the database with requested username and password
    // Creates a new salt for user, stores with username and hashed password
    // Input: username, password
    // Output: Written to db
    addUser(username, password, email, fName, lName) {
        return new Promise((success, failure) => {
            var hashy = ""
            var salty = ""
            bcrypt.makeSalt(10).then(function (saltResult) {
                salty = saltResult.salt
                return bcrypt.makeHash(password, saltResult.salt)
            }).then(function (hashResult) {
                hashy = hashResult.hash
                //myQuery = "INSERT INTO user (username, pw, salt) VALUES ('" + username + "', '" + hashy + "', '" + salty + "')"
                db.query("INSERT INTO user (username, lName, fName, pw, email, salt) VALUES ('" + username + "', '" + lName + "', '" + fName + "', '" + hashy + "', '" + email + "', '" + salty + "')", (err, data) => {
                    if (err) failure(err);
                    success(username);
                })
            })
        })
    }

    //addUser("tester", "noob")

    // Checks the username and password of a user to see if it matches the db
    // First checks for user in db, if user doesn't exist -> error
    // If they do exist, check hashed password
    // On success -> prints success, failure -> prints failure2
    // Input: username, password
    // Output: success or failure
    checkUsernameAndPassword(enteredUser, enteredPass) {
        return new Promise((success, failure) => {
            //myQuery = "SELECT * FROM user WHERE username='" + enteredUser + "'";
            db.query("SELECT * FROM user WHERE username='" + enteredUser + "'", (err, data) => {
                if (err)
                    failure(err);
                else {
                    if (!data.length) {
                        failure("data load failure");
                    }
                    else {

                        bcrypt.makeHash(enteredPass, data[0].salt).then(function (hashResult) {
                            if (hashResult.hash == data[0].pw) {
                                success({

                                    islogin: true,
                                    username: data[0].username,
                                    fName: data[0].fName,
                                    lName: data[0].lName,
                                    email: data[0].email
                                });
                            }
                            else
                                failure("Incorrect password");
                        })


                    }
                }
            })
        }).catch((err) => {
            return err;
        })
    }

    // Allows a user to change their password
    // First searches for user in db, if user doesn't exist -> error
    // Second checks user's password by hashing again and comparing to hash in db, not same -> error
    // Third changes user's password in db by generating new salt and hashing new password
    // Input: User's username, current password, requested password
    // Output: Nothing, changes in the db user's row.
    changePassword(enteredUser, enteredPass, newPass) {
        return new Promise((success, failure) => {
            //myQuery = "SELECT * FROM user WHERE username='" + enteredUser + "'"
            db.query("SELECT pw, salt FROM user WHERE username='" + enteredUser + "'", (err, data) => {
                if (err)
                    failure(err);
                else {
                    if (!data.length) {
                        failure("data load failure");
                    }
                    else {
                        bcrypt.makeHash(enteredPass, data[0].salt).then(function (hashResult) {
                            if (hashResult.hash == data[0].pw) {
                                var salty = ""
                                var hashy = ""
                                bcrypt.makeSalt(10).then(function (saltResult) {
                                    salty = saltResult.salt;
                                    return bcrypt.makeHash(newPass, saltResult.salt)
                                }).then(function (hashResult) {
                                    hashy = hashResult.hash
                                    //myNewQuery = "UPDATE user SET pw = '" + hashy + "', salt = '" + salty + "' WHERE username='" + enteredUser + "'";
                                    db.query("UPDATE user SET pw = '" + hashy + "', salt = '" + salty + "' WHERE username='" + enteredUser + "'", (err, data) => {
                                        if (err)
                                            failure(err);
                                        else
                                            success("account info changed");
                                    })
                                })
                            }
                            else
                                failure("Incorrect current Password");
                        })
                    }
                }
            })
        })
    }

    checkUsernameEmailDuplicate(enterValue, nameOrEmail) {
        return new Promise((success, failure) => {
            if (nameOrEmail) {   // username check
                db.query("SELECT username FROM user WHERE username='" + enterValue + "'", (err, data) => {
                    if (err) failure(err);
                    else if (!data.length) success();
                    else failure();
                })

            }
            else {              // email check
                db.query("SELECT email FROM user WHERE email='" + enterValue + "'", (err, data) => {
                    if (err) failure(err);
                    else if (!data.length) success();
                    else failure();
                })
            }
        })
    }
}

module.exports = UserClass;