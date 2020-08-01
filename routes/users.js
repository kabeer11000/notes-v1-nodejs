const express = require('express'),
    router = express.Router(),
    mongo = require('mongodb'),
    btoa = require('btoa'),
    MongoClient = mongo.MongoClient,
    url = "mongodb://127.0.0.1:27017/?readPreference=primary&gssapiServiceName=mongodb&appname=MongoDB%20Compass%20Community&ssl=false";


router.get('/', (req,res)=>{
  res.json('This is an backend API');
});
router.post('/save', function (req, res) {
  if (!req.body.content||!req.body.date||!req.body.uniqid ||!req.body.user_id||req.body.uniqid.length<13){
    return res.json('Some Params Were Missing');
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
    res.json('No User ID Specified');
  }
  MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
    if (err){res.json(err);throw err}
    let dbo = db.db("notes_db"), i = 0, notes = [];
    dbo.collection("notes").find({note_userid: req.params.user_id}).toArray(function (err, result) {
      if (err) throw err;
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
    });
  });
});
router.get('/get/:userid/:noteid', function (req, res, next) {
  if (!req.params.noteid.length){
    res.json('No Note ID Specified');
  }else if (!req.params.userid.length){
    res.json('No User ID Specified');
  }else {}
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
module.exports = router;
