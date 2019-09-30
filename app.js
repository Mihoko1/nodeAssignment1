/**
* Module dependencies.
*/
var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , bodyParser=require("body-parser")
    , busboy = require("then-busboy")
    , fileUpload = require('express-fileupload')
    , fs = require("fs")
    , path = require('path')
    , session = require('express-session')
    , app = express()
    , mysql = require('mysql')


var connection = mysql.createConnection({
    user: 'root',
    password: 'root',
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
    database: 'users',
    multipleStatements: true
});

connection.connect();
global.db = connection;
 
// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 60000 }
    }));
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
 
app.get('/', routes.index);//call for main index page
app.get('/signup', user.signup);//call for signup page
app.post('/signup', user.signup);//call for signup post 
app.get('/login', routes.index);//call for login page
app.post('/login', user.login);//call for login post
app.get('/feed', user.feed);//call for feed post
app.post('/feed', user.feed);//call for feed post
app.get('/logout', user.logout);//call for logout
app.get('/profile',user.profile);//to render users profile
app.post('/profile',user.profile);//to render users profile
app.get('/timeline/:id', user.timeline);//call for timeline 

app.listen(5000);
