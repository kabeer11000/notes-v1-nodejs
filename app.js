var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
var compression = require('compression');
var helmet = require('helmet');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var bodyParser = require('body-parser');
var session = require('express-session');
const indexRouter = require('./routes/index'),
    notesRouter = require('./routes/notes'),
    accountRouter = require('./routes/accounts');

var app = express();

app.use(helmet());
//app.use(compression);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true,
}));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    url: 'mongodb+srv://kabeer11000:uganda123@kabeersnotes.dpgur.mongodb.net/test?retryWrites=true&w=majority'
  })
}));
/*app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    url: 'mongodb://127.0.0.1:27017/dictionary?readPreference=primary&gssapiServiceName=mongodb&appname=MongoDB%20Compass%20Community&ssl=false'
  })
}));
*/
//mongodb+srv://kabeer11000:uganda123@kabeersnotes.dpgur.mongodb.net/test?retryWrites=true&w=majority
app.use('/', indexRouter);
app.use('/api', notesRouter);
app.use('/account', accountRouter);
//app.use('/api/add/', apiRouter);
//app.use('/users', usersRouter);

app.use(function(req, res){
  res.send(404);
});
module.exports = app;
