const express = require('express');
const router = express.Router();
const path = process.cwd();
const db = require(path + '/backend/db/db.js');
// const db = db.init();

router.post('/signup', (req, res) => {
    var sql = 'INSERT INTO user(id, pw, username, email) VALUES(?, ?, ?, ?)';
    var params = [req.body.id, req.body.pw, req.body.username, req.body.email];

    // db.connect(db);
    db.query(sql, params, function(err) {
        if(err) console.log('signup denied');
        else res.redirect('/signin');
    });
    db.end();
});

module.exports = router