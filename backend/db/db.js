const mysql = require('mysql');
const fs = require('fs');

const confFile = fs.readFileSync('config/config.json', 'utf8');
const config = JSON.parse(confFile);

var db_info = {
    host: "127.0.0.1",
    port: "3306",
    user: "",
    password: "",
    database: "foothy"
};

if (config != null) {
    db_info.host = config.DB.host;
    db_info.port = config.DB.port;
    db_info.user = config.DB.user;
    db_info.password = config.DB.password;
    db_info.database = config.DB.database;
}

const conn = mysql.createConnection(db_info);
conn.connect(function (err) {
    if (err) console.error('mysql connection error: ' + err);
    else console.log('mysql is connected successfully');
});

module.exports = conn

// module.exports = {
//     init: function(){
//         return mysql.createConnection(db_info);
//     },
//     connect: function(conn) {
//         conn.connect(function(err) {
//             if(err) console.error('mysql connection error: ' + err);
//             else console.log('mysql is connected successfully');
//         });
//     }
// }