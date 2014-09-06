angular.module('Reader')
    .controller('ReaderController', ['$scope', function($scope) { 'use strict';
        $scope.fetching = false;
        $scope.numFeeds = 0;
        $scope.feedsLoaded = 0;
        $scope.storiesLoaded = 0;
        $scope.feedData = {
            name: 'root',
            size: 2000,
            weight: 500,
            children: []
        };
        $scope.begin = false;

        var socket = io.connect('http://localhost:3000'); // Now the global io object is available
        socket.on('fetching', function(data) {
            console.log('fetching rss feeds has begun');
            $scope.fetching = true;
            $scope.numFeeds = data.numFeeds;

            $scope.$apply();
        });

        socket.on('feedLoaded', function(data) {
            console.log('a feed has been loaded');
            $scope.feedData.children.push({
                name: data.feed.feedName,
                size: data.feed.stories.length * 1000,
                children: data.feed.stories
            });

            $scope.feedsLoaded = $scope.feedData.children.length;
            $scope.storiesLoaded += data.feed.stories.length;
            $scope.begin = true;

            $scope.$digest();
        });

        socket.on('allFeedsLoaded', function(data) {
            console.log('all feeds loaded');
            $scope.fetching = false;

            $scope.$digest();
        });
    }]);