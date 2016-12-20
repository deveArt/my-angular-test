var injectParams = ['authSvc'];

var LoginController = function(authSvc) {

    var vm = this;
    vm.data = {};
    vm.data.remember = true;

    vm.submit = function() {
        console.log('work');
        console.log(vm.data);

        authSvc.login(vm.data).then(
            function (data) {
                console.log(data);
            },
            function (err) {
                console.log(err);
            }
        );
    };


};

LoginController.$inject = injectParams;
angular.module('app').controller('loginCtrl', LoginController);