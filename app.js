var express = require('express');
var app = express();
const bodyParser = require('body-parser')
var db = require('./db');
var path = require('path')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var UserRoute = require('./routes/user');
var AnamolyRoute = require('./routes/anomaly');
var CommentRoute = require('./routes/comment');

app.use(express.static(path.join(__dirname, "/")));

app.use('/anomaly/user', UserRoute);
app.use('/anomaly/anomaly', AnamolyRoute);
app.use('/anomaly/comment', CommentRoute);

module.exports = app;