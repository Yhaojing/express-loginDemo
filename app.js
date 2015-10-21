var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var control = require('./controller/user');
var session = require('express-session');
var redisStore = require('connect-redis');

//var routes = require('./routes/index');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  //store: new redisStore(),
  secret: 'someSecretToken'
}));
//注册页面
app.get('/auth/signup', function (req, res) {
  res.render('register', {message: ''});
});
//登录页面
app.get('/auth/signin', function (req, res) {
  res.render('index', {message: ''});
});
//验证页面
app.get('/auth/check', function (req, res) {
  res.render('check')
});
app.get('/', function (req, res) {
  res.render('index', {message: ''});
})
app.get('/sendcode', control.sendcode);
app.post('/auth/signup', control.create);
app.post('/auth/check', control.createUser);
app.post('/auth/login', control.login);

app.listen(3000);
module.exports = app;
