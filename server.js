var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MongoStore = require('connect-mongo')(session);
var passportSocketIo = require("passport.socketio");

var FeedParser = require('feedparser');
var http = require('http');
var S = require('string');
var moment = require('moment');
var _ = require('lodash');

//var api = require('./public/api/api');

var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);

app.set('port', 8080);
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*
    Server
 */
server.listen(app.get('port'));


/*
    mongoose
 */
mongoose.connect('mongodb://localhost/passport_local_mongoose');

/*
    Setup session store
 */
var sessionStore = new MongoStore({
    collection: 'sessions',
    mongooseConnection: mongoose.connection
});
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'foo',
    store: sessionStore
}));


/*
 Passport config
 */
io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key:         'express.sid',       // the name of the cookie where express/connect stores its session_id
    secret:      'session_secret',    // the session_secret to parse the cookie
    store:       sessionStore        // we NEED to use a sessionstore. no memorystore please
    //success:     onAuthorizeSuccess,  // *optional* callback on success - read more below
    //fail:        onAuthorizeFail,     // *optional* callback on fail/error - read more below
}));


/*
    Handle routes
 */
app.get('*', function(req, res) {
    res.redirect('/#' + req.originalUrl);
});


/*
    Handle socket connections
 */
io.on('connection', function(socket) { 'use strict';
    console.log('connect');
    var feeds = [
        {name: 'Kurzweil AI', rssUrl: 'http://www.kurzweilai.net/news/feed/atom', category: 'tech'},
        {name: 'Tech Crunch', rssUrl: 'http://feeds.feedburner.com/TechCrunch/', category: 'tech'},
        {name: 'Wired Top Stories', rssUrl: 'http://feeds.wired.com/wired/index', category: 'tech'},
        {name: 'TechRadar - All News', rssUrl: 'http://feeds2.feedburner.com/techradar/allnews', category: 'tech'},
        {name: 'ZDNet News', rssUrl: 'http://www.zdnet.com/news/rss.xml', category: 'tech'},
        {name: 'Ars Technica', rssUrl: 'http://feeds.arstechnica.com/arstechnica/index', category: 'tech'},
        {name: 'Engadget', rssUrl: 'http://podcasts.engadget.com/rss.xml', category: 'tech'},
        {name: 'Gizmodo', rssUrl: 'http://feeds.gawker.com/gizmodo/full', category: 'tech'},
        {name: 'Business Insider', rssUrl: 'http://feeds2.feedburner.com/businessinsider', category: 'business'},
        {name: 'Fast Company', rssUrl: 'http://feeds.feedburner.com/fastcompany/headlines', category: 'business'},
        {name: 'The Atlantic Business', rssUrl: 'http://feeds.feedburner.com/AtlanticBusinessChannel', category: 'business'},
        {name: 'The Economist Business and Finance', rssUrl: 'http://www.economist.com/sections/business-finance/rss.xml', category: 'business'},
        {name: 'VentureBeat', rssUrl: 'http://feeds.venturebeat.com/VentureBeat', category: 'business'},
        {name: 'Smashing Magazine', rssUrl: 'http://www.smashingmagazine.com/feed/', category: 'design'},
        {name: 'The UX Booth', rssUrl: 'http://feeds.feedburner.com/uxbooth', category: 'design'},
        {name: 'UX Magazine', rssUrl: 'http://feeds.feedburner.com/UXM', category: 'design'}
    ];
    var categories = ['tech', 'business', 'design'],
        feedsLoaded = 0;

    function allFeedsLoaded() { // JS funcs that don't hit explicit return statement return undefined
        if(feedsLoaded >= feeds.length) {
            return true;
        }
    };

    socket.emit('fetching', {
        msg: 'fetching rss data',
        numFeeds: feeds.length,
        categories: categories
    });

    _.map(feeds, function(item) {
            http.get(item.rssUrl, function (r) {
                var feedData = {};
                feedData.stories = [];
                feedData.feedName = item.name;
                feedData.feedCategory = item.category;
                r.pipe(new FeedParser({
                    'normalize': true
                }))
                    .on('error', function (err) {
                        console.log('Failed to retrieve RSS: ' + item.name);
                    })
                    .on('meta', function (meta) {
                        feedData.feedMeta = meta;
                    })
                    .on('readable', function () {
                        var stream = this,
                            item;
                        while (item = stream.read()) {
                            var story = {
                                'title': S(S(item.title).stripTags().s).decodeHTMLEntities().s,
                                'summary': S(S(item.summary).stripTags().s).decodeHTMLEntities().s.substring(0, 100),
                                'date': moment(item.date).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                                'link': item.link,
                                'guid': item.guid,
                                'author': item.author,
                                'comments': item.comments,
                                'from': item.meta.title,
                                'fromDescription': item.meta.description,
                                'fromUrl': item.meta.link
                            };
                            feedData.stories.push(story);
                        }
                    })
                    .on('end', function () {
                        socket.emit('feedLoaded', {
                            feed: feedData
                        });
                        feedsLoaded++;
                        if(allFeedsLoaded()) {
                            socket.emit('allFeedsLoaded', {
                                num: feedsLoaded
                            });
                        }
                    });
            });
        }
    );

    socket.on('disconnect', function() {
        console.log('User disconnected');
    });
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
