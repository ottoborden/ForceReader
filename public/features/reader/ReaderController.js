angular.module('Reader')
    .controller('ReaderController', ['$scope', '$http', function($scope, $http) { 'use strict';
        $http.get('api/reader').success(function(data) {
            $scope.feeds = ['Kurzweil AI'];
            $scope.rssData = data;
        })
        .error(function(err) {
            console.log('Error getting RSS data.');
            console.log(err);
        });
    }]);