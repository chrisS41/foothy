const mysql = require('mysql');
const fs = require('fs');

const dbfile = fs.readFileSync('config/dbinfo.json', 'utf8');
const dbinfo = JSON.parse(dbfile);

var db_info = {
    host: "127.0.0.1",
    port: "3306",
    user: "",
    password: "",
    database: "foothy"
};

if (dbinfo != null) {
    db_info.host = dbinfo.host;
    db_info.port = dbinfo.port;
    db_info.user = dbinfo.user;
    db_info.password = dbinfo.password;
    db_info.database = dbinfo.database;
}

module.exports = {
    init: function(){
        return mysql.createConnection(db_info);
    },
    connect: function(conn) {
        conn.connect(function(err) {
            if(err) console.error('mysql connection error: ' + err);
            else console.log('mysql is connected successfully');
        });
    }
}