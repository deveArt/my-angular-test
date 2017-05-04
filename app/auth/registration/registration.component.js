angular.module('app.auth')
    .component('registration', {
        controller: RegistrationController,
        templateUrl: '/app/auth/registration/registration.component.tmpl.html'
    });

RegistrationController.$inject = ['authService', 'globalVars'];
function RegistrationController(authService, globalVars) {

    var $ctrl = this;

    $ctrl.globalVars = globalVars.data;
    $ctrl.data = {};
    $ctrl.pwdRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[$@!%*#?&])[A-Za-z\d$@!%*#?&]+$/;

    $ctrl.submit = submit;

    function submit() {
        console.log('valid');
        authService.registrate($ctrl.data).then(function (response) {
            console.log('ok');
        }).catch(function (error) {
            console.error(error);
        });
    }
}
