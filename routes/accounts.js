const express = require('express'),
    router = express.Router(),
    mongo = require('mongodb'),
    path = require('path'),
    MongoClient = mongo.MongoClient,
    url = "mongodb://127.0.0.1:27017/?readPreference=primary&gssapiServiceName=mongodb&appname=MongoDB%20Compass%20Community&ssl=false";

function k_hash(a) {
    return require('crypto').createHash('md5').update(a).digest("hex")
}

function checkToken(req, d) {
    if (req.session.token === d.token && req.session.userid === d.userid) {
        return true;
    }
}
router.post('/user/signup', function (req, res, next) {
    if (!req.body.password || !req.body.username) {
        return res.json('Some Params Were Missing');
    }

    function makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) {
            res.json('Cannot Connect to DB');
        }
        let dbo = db.db("notes_db");
        const today = new Date(),
            date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(),
            time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let user_obj = {
            user_reg_date: date + ' ' + time,
            user_userid: makeid(13),
            user_username: req.body.username,
            user_password: k_hash(req.body.password),
            server_uniqid: makeid(20),
        };
        dbo.collection("users").updateOne({$or: [{user_userid: user_obj.server_uniqid}, {user_username: user_obj.user_username}]}, {$set: user_obj}, {upsert: true}, function (err, result) {
            if (result){
                req.session.token = k_hash(req.body.username + ':' + req.body.password);
                req.session.username = req.body.username;
                req.session.userid = result.user_userid;
                res.send(`<script>window.localStorage.setItem('user', JSON.stringify({username: "${req.body.username}", password: "${result.user_password}", user_id: "${result.user_userid}"}) );window.location.href="/"</script>`);
            }
        });
    });
});
router.post('/user/signin', function (req, res) {
    if (!req.body.password || !req.body.username) {
        return res.json('Some Params Were Missing');
    }
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) {
            res.json('Cannot Connect to DB');
            throw err;
        }
        let dbo = db.db("notes_db");

        dbo.collection("users").findOne({
            user_username: req.body.username,
            user_password: k_hash(req.body.password)
        }, function (err, result) {
            if (err) {
                throw err;
            }else{}
            if (result){
                req.session.token = k_hash(req.body.username + ':' + req.body.password);
                req.session.username = req.body.username;
                req.session.userid = result.user_userid;
                res.send(`<script>window.localStorage.setItem('user', JSON.stringify({username: "${req.body.username}", password: "${result.user_password}", user_id: "${result.user_userid}"}) );window.location.href="/"</script>`);

//                res.redirect('/');
            }else{}
        });
    });
});

router.get('/logout', (req,res)=>{
    req.session.destroy();
    res.redirect('/')
});
module.exports = router;
