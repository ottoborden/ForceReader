angular.module('myApp', [
    'ngRoute'
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