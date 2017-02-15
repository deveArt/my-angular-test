var injectParams = ['authSvc', '$cookies', '$rootScope', '$location'];

var LoginController = function(authSvc, $cookies, $rootScope, $location) {

    var vm = this;
    vm.data = {};
    vm.data.rememberMe = true;

    vm.submit = function() {

        authSvc.login(vm.data).then(function (response) {

            vm.formErrors = response.data.errors || {};

            if (!response.data.errors) {
                console.log($cookies.getAll());
                $rootScope.loggedIn = true;
                $location.path("/translations");
            }

            for (var i in vm.loginForm.$$controls) {
                var control = vm.loginForm.$$controls[i];

                if (vm.formErrors[control.$name]) {
                    control.$setValidity(control.$name, false);
                } else {
                    control.$setValidity(control.$name, true);
                }
            }

        }).catch(function (error) {
            console.error(error);
        });
    };
};

LoginController.$inject = injectParams;
angular.module('app').controller('loginCtrl', LoginController);
