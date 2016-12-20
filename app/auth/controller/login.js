
angular
    .module('app')
    .controller('loginCtrl', ['$scope', function($scope) {

        var vm = this;
        $scope.master = {};

        $scope.update = function(user) {
            $scope.master = angular.copy(user);
        };

        $scope.reset = function() {
            $scope.user = angular.copy($scope.master);
        };

        $scope.reset();
    }]);
