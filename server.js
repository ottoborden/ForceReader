var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var api = require('./public/api/api');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api);
app.get('*', function(req, res) {
    res.redirect('/#' + req.originalUrl);
});

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

/// error handlers

// development error handler
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;
