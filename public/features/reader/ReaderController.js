angular.module('Reader')
    .controller('ReaderController', ['$scope', function($scope) { 'use strict';
        $scope.fetching = false;
        $scope.numFeeds = 0;
        $scope.feedsLoaded = 0;
        $scope.storiesLoaded = 0;
        $scope.feedData = {
            name: 'root',
            size: 30000,
            weight: 500,
            children: [
                {
                    name: 'tech',
                    size: 25000,
                    weight: 500,
                    children: []
                },
                {
                    name: 'other',
                    size: 25000,
                    weight: 500,
                    children: []
                }
            ],
            fixed: 0
        };

        var socket = io.connect('http://localhost:8080'); // Now the global io object is available
        socket.on('fetching', function(data) {
            console.log('fetching rss feeds has begun');
            $scope.fetching = true;
            $scope.numFeeds = data.numFeeds;

            $scope.$apply();
        });

        socket.on('feedLoaded', function(data) {
            console.log('a feed has been loaded');
            var cat;
            $scope.feedData.children.forEach(function(item) {
                if(item.name === data.feed.feedCategory) {
                    cat = item;
                }
            });
            cat.children.push({
                name: data.feed.feedName,
                size: data.feed.stories.length * 1000,
                children: data.feed.stories
            });

            $scope.feedsLoaded += 1;
            $scope.storiesLoaded += data.feed.stories.length;

            $scope.$digest();
        });

        socket.on('allFeedsLoaded', function(data) {
            console.log('all feeds loaded');
            $scope.fetching = false;

            console.log($scope.feedData);

            $scope.$digest();
        });
    }]);