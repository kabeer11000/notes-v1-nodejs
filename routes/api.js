var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var url = "mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb";
var parseURL = require('.././bin/js/urlparser');
var makeTextFilter = (text) => {
    var wordSplited = text.split(/\s+/);
    /** Regex generation for words */
    var regToMatch = new RegExp(wordSplited.join("|"), 'gi');
    let filter = [];
    searchFieldArray.map((item,i) => {
        filter.push({});
        filter[i][item] = {
            $regex: regToMatch,
            $options: 'i'
        }
    });

    return filter;
};
//var db = require('.././bin/database/dbConnect');
//const fs = require('fs');
//const request = require('request');
/* GET home page. */
router.post('/', function (req, res, next) {
    /*
        var query = require('url').parse(req.url,true).query;
    const sql = `SELECT * FROM clients WHERE uniqueId = ${query.uniqid} `;
      db.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        db.query(sql, function (err, result) {
          if (err) throw err;
          console.log("Result: " + result);
        });
      });
    */
    //http://localhost:3000/api/?redirect=http://drive.hosted-kabeersnetwork.unaux.com/server/scripts/login-signup-server.php&clientId=notes12&action=login
    var query = req.body;

    if (!req.body.r_d.length || !req.body.name.length){
        return res.json('Some Params Were Missing');
    }
    let uniqid=(e="",t=!1)=>{let n=(Date.now()/1e3).toString(16).split(".").join("");for(;n.length<14;)n+="0";let o="";return t&&(o=".",o+=Math.round(1e8*Math.random())),e+n+o};
    //var url = "mongodb+srv://kabeer11000:uganda123@cluster0-ortwf.gcp.mongodb.net/?retryWrites=true&w=majority";
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true},function(err, db) {
        if (err) {res.json('Cannot Connect to DB'); throw err}
        let dbo = db.db("auth"), myobj = { name: decodeURIComponent(escape(query.name)), uniqid: uniqid(), redirect_domain: encodeURIComponent(query.r_d) };
        dbo.getCollection('clients').find({ redirect_domain: {$regex: parseURL(decodeURIComponent(query.r_d)).host, $options: makeTextFilter(parseURL(decodeURIComponent(query.r_d)).host)}})
        dbo.collection("clients").insertOne(myobj, {}, function (err) {
            if (err) throw err;
//            res.redirect(path.join(__dirname, '.././users/request'));
              res.redirect('../.././users/request');
            //res.sendFile(path.join(__dirname, '.././public/request.html'));
            console.log("1 document inserted");
        });
    });
/*
    const sql = `SELECT * FROM clients WHERE uniqueId = '${query.clientId}' LIMIT 1`;
    db.connect(function(err) {
        if (err) throw err;res.json('Failed to connect to DB');
        console.log("Connected!");
        db.query(sql, function (err, result) {
            if (err) throw err;
            if (parseURL(result[0].redirect_domain).host  === parseURL(query.redirect).host){
               res.json(result[0]);
            }else {
                res.json(`${parseURL(result[0].redirect_domain).host}<br>${parseURL(query.redirect).host}`);
            }
        });
    });*/
});
router.get('/', function (req, res, next) {
    let query = require('url').parse(req.url,true).query;
    if (!query.redirect.length||!query.action.length||!query.clientId.length){
        return res.json('No Action Specified');
    }
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err){res.json(err);throw err}
        var dbo = db.db("auth");
        dbo.collection("clients").findOne({uniqid: escape(query.clientId)}, function (err, result) {
            if (err) throw err;
            if (parseURL(decodeURIComponent(result.redirect_domain)).host === parseURL(decodeURIComponent(query.redirect)).host){

                res.append('Warning', '199 Miscellaneous warning')
                res.json(result);
                if (query.action === 'login'){

                }else {

                }
            }else {
                res.json('Bharway Gand Mara')
            }
        });
    });
});
module.exports = router;
