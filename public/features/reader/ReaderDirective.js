angular.module('Reader')
    .directive('readerDirective', ['$compile', 'd3Service', function($compile, d3Service) { 'use strict';
        return {
            restrict: 'A',
            link: function link(scope, element, attrs) {
                console.log('link');
            }
        }
    }]);