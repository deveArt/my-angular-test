angular
    .module('app.auth')
    .component('login', {
        controller: LoginController,
        templateUrl: '/app/auth/login/login.component.tmpl.html'
    });

LoginController.$inject = ['authService', '$cookies', '$location', 'globalVars'];
function LoginController(authService, $cookies, $location, globalVars) {

    var $ctrl = this;

    $ctrl.globalVars = globalVars.data;
    $ctrl.data = {};
    $ctrl.data.rememberMe = true;

    $ctrl.submit = submit;

    function submit() {

        authService.login($ctrl.data).then(function (response) {

            $ctrl.formErrors = response.data.errors || {};

            if (!response.data.errors) {
                console.log($cookies.getAll());
                globalVars.setVar('loggedIn', true);
                $location.path("/translations");
            }

            for (let i in $ctrl.loginForm.$$controls) {
                let control = $ctrl.loginForm.$$controls[i];

                if ($ctrl.formErrors[control.$name]) {
                    control.$setValidity(control.$name, false);
                } else {
                    control.$setValidity(control.$name, true);
                }
            }

        }).catch(function (error) {
            console.error(error);
        });
    }
}
