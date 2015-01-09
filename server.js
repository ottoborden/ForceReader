var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var FeedParser = require('feedparser');
var http = require('http');
var S = require('string');
var moment = require('moment');
var _ = require('lodash');

//var api = require('./public/api/api');

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.set('port', process.env.PORT || 3000);
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
    Handle routes
 */
app.get('*', function(req, res) {
    res.redirect('/#' + req.originalUrl);
});

/*app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});*/


/*
    Handle socket connections
 */
io.on('connection', function(socket) { 'use strict';
    var feeds = [
        {name: 'Kurzweil AI', rssUrl: 'http://www.kurzweilai.net/news/feed/atom'},
        {name: 'Tech Crunch', rssUrl: 'http://feeds.feedburner.com/TechCrunch/'},
        {name: 'Wired Top Stories', rssUrl: 'http://feeds.wired.com/wired/index'},
        {name: 'TechRadar - All News', rssUrl: 'http://feeds2.feedburner.com/techradar/allnews'},
        {name: 'ZDNet News', rssUrl: 'http://www.zdnet.com/news/rss.xml'},
        //{name: 'TechRepublic News', rssUrl: 'http://www.techrepublic.com/rssfeeds/articles/latest/'}
    ];
    var numFeeds = feeds.length,
        feedsLoaded = 0;

    function allFeedsLoaded() { // JS funcs that don't hit explicit return statement return undefined
        if(feedsLoaded >= numFeeds) {
            return true;
        }
    };

    console.log('connect');

    socket.emit('fetching', {
        msg: 'fetching rss data',
        numFeeds: feeds.length
    });

    _.map(feeds, function(item) {
            http.get(item.rssUrl, function (r) {
                var feedData = {};
                feedData.stories = [];
                feedData.feedName = item.name;
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
