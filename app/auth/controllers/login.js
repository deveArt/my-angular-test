angular
    .module('app')
    .controller('loginCtrl', ['$scope', function($scope) {

        var vm = this;
        vm.submit = function() {
            console.log('work');
        };


    }]);
