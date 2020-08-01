var express = require('express');
var router = express.Router();
var path = require('path');

function checkToken(req){
    if (req.session.userid){
        return true;
    }
}

router.get('/', function(req, res, next) {
  if(!checkToken(req)){
    res.redirect('/login');
  }else{
    res.sendFile(path.join(__dirname, '.././src/index.html'));
  }
});
router.get('/login', function(req, res, next) {
  if(!checkToken(req)){
    res.sendFile(path.join(__dirname, '.././src/login.html'));
  }else{
    res.redirect('/')
  }
});
module.exports = router;
