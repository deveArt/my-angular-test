var injectParams = ['authSvc', '$cookies', '$rootScope', '$location'];

var RegistrationController = function(authSvc, $cookies, $rootScope, $location) {

    var vm = this;
    vm.data = {};

    vm.submit = function() {
        console.log('valid');
        authSvc.registrate(vm.data).then(function (response) {
            console.log('ok');
        }).catch(function (error) {
            console.error(error);
        });
    };
};

RegistrationController.$inject = injectParams;
angular.module('app').controller('registrationCtrl', RegistrationController);
