angular
    .module('app.common')
    .component('passwordConfirm', {
        templateUrl: '/app/common/password-confirm/password-confirm.component.tmpl.html',
        controller: passwordConfirmController,
        bindings: {
            password: '<'
        }
    });

function passwordConfirmController() {
    var $ctrl = this;

    $ctrl.$onChanges = check;

    function check() {
        if (!$ctrl.passwordConfirmForm) {
            return;
        }

        $ctrl.passwordConfirmForm.newpasswordrepeat.$setValidity('match', $ctrl.password === $ctrl.passwordConfirm);
    }
}
