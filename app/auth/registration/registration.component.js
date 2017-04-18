angular.module('app.auth')
    .component('registration', {
        controller: RegistrationController,
        templateUrl: '/app/auth/registration/registration.component.tmpl.html'
    });

RegistrationController.$inject = ['authService'];
function RegistrationController(authService) {

    var $ctrl = this;
    $ctrl.data = {};
    $ctrl.pwdRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[$@!%*#?&])[A-Za-z\d$@!%*#?&]+$/;

    $ctrl.submit = function() {
        console.log('valid');
        authService.registrate($ctrl.data).then(function (response) {
            console.log('ok');
        }).catch(function (error) {
            console.error(error);
        });
    };
}
