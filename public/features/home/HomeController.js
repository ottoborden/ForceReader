angular.module('Home')
    .controller('HomeController', ['$scope', '$http', function($scope, $http) {
        function getLatestCommit() {
            $http.get('https://api.github.com/repos/ottoborden/ForceReader/commits').success(function (res) {
                if(res.length) {
                    $scope.latestCommit = moment(res[0].commit.author.date).format("dddd, MMMM Do YYYY, h:mm:ss a");
                }
            });
        }

        function getForks() {
            $http.get('https://api.github.com/repos/ottoborden/ForceReader/forks').success(function (res) {
                $scope.forks = res.length;
            });
        }

        getLatestCommit();
        getForks();

        $scope.latestCommit = '';
        $scope.forks = '';
    }]);