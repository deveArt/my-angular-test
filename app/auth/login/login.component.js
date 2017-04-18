angular
    .module('app.auth')
    .component('login', {
        controller: LoginController,
        templateUrl: '/app/auth/login/login.component.tmpl.html'
    });

LoginController.$inject = ['authService', '$cookies', '$rootScope', '$location'];
function LoginController(authService, $cookies, $rootScope, $location) {

    var $ctrl = this;
    $ctrl.data = {};
    $ctrl.data.rememberMe = true;

    $ctrl.submit = function() {

        authService.login($ctrl.data).then(function (response) {

            $ctrl.formErrors = response.data.errors || {};

            if (!response.data.errors) {
                console.log($cookies.getAll());
                $rootScope.loggedIn = true;
                $location.path("/translations");
            }

            for (var i in $ctrl.loginForm.$$controls) {
                var control = $ctrl.loginForm.$$controls[i];

                if ($ctrl.formErrors[control.$name]) {
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
