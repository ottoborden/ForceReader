angular.module('Home')
    .controller('HomeController', ['$scope', '$http', function($scope, $http) {
        console.log('homectrl');

        // Make this topics
        $scope.genres = ['Action', 'Adventure', 'Animation', 'Children', 'Comedy',
            'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'Food',
            'Home and Garden', 'Horror', 'Mini-Series', 'Mystery', 'News', 'Reality',
            'Romance', 'Sci-Fi', 'Sport', 'Suspense', 'Talk Show', 'Thriller',
            'Travel'];
    }]);