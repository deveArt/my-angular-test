var injectParams = ['authSvc'];

var LoginController = function(authSvc) {

    var vm = this;
    vm.data = {};
    vm.data.rememberMe = true;

    vm.submit = function() {
        console.log('work');
        console.log(vm.data);

        authSvc.login(vm.data).then(function (data) {
            console.log(vm.loginForm);
            vm.formErrors = data.data.errors;

            if (vm.formErrors.main) {
                vm.loginForm.$setUntouched();
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
