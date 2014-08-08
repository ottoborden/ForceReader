angular.module('Home')
    .directive('homeDirective', [function() {
        return {
            restrict: 'AE',
            templateUrl: 'home.html'
        }
    }]);