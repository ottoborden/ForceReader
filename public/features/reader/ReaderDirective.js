angular.module('Reader')
    .directive('readerDirective', ['d3Service', function(d3Service) { 'use strict';
        return {
            restrict: 'AE',
            link: function link(scope, element, attrs) {
                console.log(d3);
            }
        }
    }]);