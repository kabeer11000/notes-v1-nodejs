var mysql = require('mysql');

var db = mysql.createConnection({
    host: "sql12.freemysqlhosting.net",
    user: "sql12356860",
    password: "M5nSfNWf1j",
    database: "sql12356860",
});
/*
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});
*/
module.exports = db;
