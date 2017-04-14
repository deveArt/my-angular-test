angular.module('app.auth')
    .component('registration', {
        controller: RegistrationController,
        templateUrl: '/app/auth/registration/registration.component.tmpl.html'
    });

RegistrationController.$inject = ['authSvc'];
function RegistrationController(authSvc) {

    var vm = this;
    vm.data = {};
    vm.pwdRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[$@!%*#?&])[A-Za-z\d$@!%*#?&]+$/;

    vm.submit = function() {
        console.log('valid');
        authSvc.registrate(vm.data).then(function (response) {
            console.log('ok');
        }).catch(function (error) {
            console.error(error);
        });
    };
}
