angular.module('app.auth')
    .component('registration', {
        controller: RegistrationController,
        templateUrl: '/app/auth/registration/registration.component.tmpl.html'
    });

RegistrationController.$inject = ['authService'];
function RegistrationController(authService) {

    var vm = this;
    vm.data = {};
    vm.pwdRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[$@!%*#?&])[A-Za-z\d$@!%*#?&]+$/;

    vm.submit = function() {
        console.log('valid');
        authService.registrate(vm.data).then(function (response) {
            console.log('ok');
        }).catch(function (error) {
            console.error(error);
        });
    };
}
