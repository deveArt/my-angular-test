angular.module('app.auth')
    .component('login', {
        controller: LoginController,
        templateUrl: '/app/auth/login/login.component.tmpl.html'
    });

LoginController.$inject = ['authSvc', '$cookies', '$rootScope', '$location'];
function LoginController(authSvc, $cookies, $rootScope, $location) {

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
}

