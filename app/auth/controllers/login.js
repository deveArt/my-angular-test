var injectParams = ['authSvc'];

var LoginController = function(authSvc) {

    var vm = this;
    vm.data = {};
    vm.data.rememberMe = true;

    vm.submit = function() {
        vm.loginForm.$setPristine(true);

        authSvc.login(vm.data).then(function (data) {
            vm.loginForm.$setSubmitted(true);
            vm.formErrors = data.data.errors || {};

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
