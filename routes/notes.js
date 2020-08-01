const express = require('express'),
    router = express.Router(),
    mongo = require('mongodb'),
    btoa = require('btoa'),
    MongoClient = mongo.MongoClient;
//var url = "mongodb://127.0.0.1:27017/?readPreference=primary&gssapiServiceName=mongodb&appname=MongoDB%20Compass%20Community&ssl=false";
var url = 'mongodb+srv://kabeer11000:uganda123@kabeersnotes.dpgur.mongodb.net/test?retryWrites=true&w=majority';

function k_hash(a) {
    return require('crypto').createHash('md5').update(a).digest("hex")
}
function checkToken(req, user_id){/*
    if (req.session.userid === d.userid){
        return true;
    }*/
    return req.session.userid === user_id;
}
router.get('/', (req,res)=>{
    res.json('This is a backend API, Go Away');
});
router.post('/save', function (req, res) {
    if (!req.body.content||!req.body.date||!req.body.uniqid ||!req.body.user_id){
        return res.json('Some Params Were Missing');
    }
    if(req.session.userid !== req.body.user_id){
        return res.json('UnAuthorized Bad Request');
    }
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true},function(err, db) {
        if (err) {res.json('Cannot Connect to DB');throw err;}
        let dbo = db.db("notes_db");
        let note_post = {
                note_date: req.body.date,
                note_uniqid: req.body.uniqid,
                server_uniqid: btoa(req.body.date+':'+req.body.uniqid),
                note_content: decodeURIComponent(new Buffer(req.body.content, 'base64').toString('ascii')),
                note_userid: req.body.user_id,
            };
        dbo.collection("notes").updateOne({server_uniqid: note_post.server_uniqid}, {$set: note_post},{upsert:true}, function (err) {
            res.append('Access-Control-Allow-Origin', '*');
            note_post.status = 'done';
            res.json(note_post);
        });
    });
});
router.get('/get/all/:user_id/:start?/:end?', function (req, res, next) {
    if (!req.params.user_id.length){
        return res.json('No User ID Specified');
    }
    if(req.session.userid !== req.params.user_id){
        return res.json('UnAuthorized Bad Request');
    }
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err){return res.json(err);throw err}
        let dbo = db.db("notes_db"), i = 0, notes = [];
        dbo.collection("notes").find({note_userid: req.params.user_id}).toArray(function (err, result) {
            if (err){throw err;}else {

            }
            if(result){
                res.append('Access-Control-Allow-Origin', '*');
                while (result[i]){
                    notes.push({date: result[i].note_date, content: result[i].note_content, uniqid: result[i].note_uniqid, user_id: result[i].note_userid});
                    i++;
                }
                if (req.params.start && req.params.end){
                    res.json(notes.splice(req.params.start, req.params.end));
                }else {
                    res.json(notes);
                }
            }else{}
        });
    });
});

router.get('/get/:userid/:noteid', function (req, res, next) {
    if (!req.params.noteid.length){
        res.json('No Note ID Specified');
    }else if (!req.params.userid.length){
        res.json('No User ID Specified');
    }else {}
    if(req.session.userid !== req.params.userid){
        return res.json('UnAuthorized Bad Request');
    }
    const query = req.params;
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err){res.json(err); throw err}else {}
        let dbo = db.db("notes_db");
        dbo.collection("notes").findOne({note_uniqid: escape(decodeURIComponent(query.noteid)), note_userid: escape(decodeURIComponent(query.userid))}, function (err, result) {
            if (err) {throw err}else{}
            res.json({date: result.note_date, content: result.note_content, uniqid: result.note_uniqid, user_id: result.note_userid});
        });
    });
});
router.get('/delete/all/:user_id', function (req, res, next) {
    if (!req.params.user_id.length){
        return res.json('No User ID Specified');
    }
    if(req.session.userid !== req.params.user_id){
        return res.json('UnAuthorized Bad Request');
    }
    const query = req.params;
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        let dbo = db.db("notes_db");
        dbo.collection("notes").deleteMany({note_userid: escape(query.user_id) }, function (err) {
            res.json('Notes Deleted');
        });
    });
});
router.get('/delete/one/:userid/:noteid', function (req, res, next) {
    if (!req.params.noteid.length){
        return res.json('No Note ID Specified');
    }
    if (!req.params.userid.length){
        return res.json('No User ID Specified');
    }
    if(req.session.userid !== req.params.userid){
        return res.json('UnAuthorized Bad Request');
    }
    const query = req.params;
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err){res.json(err); throw err}
        let dbo = db.db("notes_db");
        dbo.collection("notes").deleteOne({note_uniqid: escape(decodeURIComponent(query.noteid)), note_userid: escape(decodeURIComponent(query.userid))}, function (err) {
            if (err) throw err;
            res.append('Access-Control-Allow-Origin', '*');
            res.json('Note Deleted');
        });
    });
});
router.post('/user/signup', function (req, res, next) {
    if (!req.body.password||!req.body.username){
        return res.json('Some Params Were Missing');
    }
    function makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true},function(err, db) {
        if (err) {res.json('Cannot Connect to DB');}
        let dbo = db.db("notes_db");
        const today = new Date(),
            date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(),
            time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
/*        let user_obj = {
            user_reg_date: date+' '+time,
            user_userid: makeid(13),
            user_username: req.body.username,
            user_password: k_hash(req.body.password),
            server_uniqid: makeid(20),
        };*/
        let user_obj = {
            user_reg_date: date+' '+time,
            user_userid: makeid(13),
            user_username: 'kabeer11000',
            user_password: k_hash('uganda123'),
            server_uniqid: makeid(20),
        };
        dbo.collection("users").updateOne({$or: [{user_userid: user_obj.server_uniqid}, {user_username: user_obj.user_username}]}, {$set: user_obj},{upsert:true}, function (err) {
            res.append('Access-Control-Allow-Origin', '*');
            user_obj.status = 'Registered';
            //req.session.token = k_hash(req.body.username+':'+req.body.password);
            //req.session.username = req.body.username;
            //req.session.userid = user_obj.user_userid;
            res.json(user_obj);
        });
    });
});
router.post('/user/signin', function (req, res) {
    if (!req.body.password||!req.body.username){
        return res.json('Some Params Were Missing');
    }
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true},function(err, db) {
        if (err) {res.json('Cannot Connect to DB');throw err;}
        let dbo = db.db("notes_db");

        dbo.collection("users").findOne({
            user_username: req.body.username,
            user_password: k_hash(req.body.password)}, function (err, result) {
            if (err) {throw err}else{}
            req.session.token = k_hash(req.body.username+':'+req.body.password);
            res.append('Access-Control-Allow-Origin', '*');
            res.json({
                user_reg_date: result.user_reg_date,
                user_userid: result.user_userid,
                user_username: result.user_username,
                user_password: result.user_password
            });
        });
    });
});
router.post('/user/session/token', function (req, res) {
    if (!req.body.password||!req.body.username||!req.body.user_id){
        return res.json('Some Params Were Missing');
    }
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true},function(err, db) {
        if (err) {res.json('Cannot Connect to DB');throw err;}
        let dbo = db.db("notes_db");
        dbo.collection("users").findOne({
            user_username: req.body.username,
            user_password: k_hash(req.body.password)}, function (err, result) {
            if (err) {throw err}else{}
            if (result){
                req.session.token = k_hash(req.body.username+':'+req.body.password);
                req.session.userid = req.body.user_id;
                req.session.username = req.body.username;
                res.append('Access-Control-Allow-Origin', '*');
                res.json({
                    status: 'signed in',
                    user_reg_date: result.user_reg_date,
                    user_userid: result.user_userid,
                    user_username: result.user_username,
                    user_password: result.user_password,
                    token: req.session.token
                });
            }else {
                res.append('Access-Control-Allow-Origin', '*');
                res.json({status: 'invalid username or password'})

            }
        });
    });
});
router.get('/user/signin/ui/:username', function (req, res) {
    if (!req.params.username){
        return res.json('Some Params Were Missing');
    }
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true},function(err, db) {
        if (err) {res.json('Cannot Connect to DB');throw err;}
        let dbo = db.db("notes_db");

        dbo.collection("users").findOne({
            user_username: req.params.username}, function (err, result) {
            if (err) {throw err;}
            if (result){
                res.append('Access-Control-Allow-Origin', '*');
                res.json({status:1});
            }else{
                res.append('Access-Control-Allow-Origin', '*');
                res.json({status:0});
            }
        });
    });
});

module.exports = router;
