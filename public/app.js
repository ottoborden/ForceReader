angular.module('d3', []).factory('d3Service', [function() {
    var d3;
    return d3;
}]);

angular.module('lodash', []).factory('lodashService', [function() {
    var _;
    return _;
}]);

angular.module('myApp', [
    'ngRoute',
    'Home',
    'Reader',
    'd3'
]).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            templateUrl: 'features/home/home.html',
            controller: 'HomeController'
        })
        .when('/reader', {
            templateUrl: 'features/reader/reader.html',
            controller: 'ReaderController'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);