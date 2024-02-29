const express = require('express');
const router = express.Router();
const db = require(__dirname + '/../db/db.js');
const conn = db.init();

router.post('/signup', (req, res) => {
    var sql = 'INSERT INTO user(id, pw, username, email) VALUES(?, ?, ?, ?)';
    var params = [req.body.id, req.body.pw, req.body.username, req.body.email];

    db.connect(conn);
    conn.query(sql, params, function(err) {
        if(err) console.log('signup denied');
        else res.redirect('/signin');
    });
    db.end();
});

module.exports = router