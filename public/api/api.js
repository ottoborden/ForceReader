var express = require('express');
var router = express.Router();
var FeedParser = require('feedparser');
var http = require('http');
var S = require('string');
var moment = require('moment');
var _ = require('lodash');
var request = require('request');


router.get('/reader', function(req, res) {
    'use strict';

    var feeds = [
        {name: 'Kurzweil AI', rssUrl: 'http://www.kurzweilai.net/news/feed/atom'},
        {name: 'Tech Crunch', rssUrl: 'http://feeds.feedburner.com/TechCrunch/'}
    ];

    /*_.map(feeds, function(item) {
        var feedData = {};
        feedData.stories = [];
        feedData.feedName = item.name;

        var x = request(item.rssUrl)
            , feedparser = new FeedParser({
                'normalize': true
            });

        x.on('error', function (error) {
            // handle any request errors
        });
        x.on('response', function (res) {
            var stream = this;

            if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

            stream.pipe(feedparser);
        });

        feedparser.on('error', function(error) {
            // always handle errors
        });
        feedparser.on('readable', function() {
            // This is where the action is!
            var stream = this
                , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
                , item;
            stream.stories = [];

            while (item = stream.read()) {
                var story = {
                    'title': S(S(item.title).stripTags().s).decodeHTMLEntities().s,
                    'summary': S(S(item.summary).stripTags().s).decodeHTMLEntities().s,
                    'date': moment(item.date).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                    'link': item.link,
                    'guid': item.guid,
                    'author': item.author,
                    'comments': item.comments,
                    'from': item.meta.title,
                    'fromDescription': item.meta.description,
                    'fromUrl': item.meta.link
                }
                stream.stories.push(story);
            }
        });
        feedparser.on('end', function() {
            var stream = this;
            stream.pipe(res);
            console.log(stream.pipe(res));
        });
    });*/

    /*_.map(feeds, function(item) {
            http.get(item.rssUrl, function (r) {
                var feedData = {};
                feedData.stories = [];
                feedData.feedName = item.name;
                r.pipe(new FeedParser({
                    'normalize': true
                }))
                    .on('error', function (err) {
                        console.log('Failed to retrieve RSS.');
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
                                'summary': S(S(item.summary).stripTags().s).decodeHTMLEntities().s,
                                'date': moment(item.date).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                                'link': item.link,
                                'guid': item.guid,
                                'author': item.author,
                                'comments': item.comments,
                                'from': item.meta.title,
                                'fromDescription': item.meta.description,
                                'fromUrl': item.meta.link
                            }
                            feedData.stories.push(story);
                        }
                    })
                    .on('end', function () {
                        res.pipe(feedData);
                    });
            });
        }
    );*/
});

module.exports = router;