angular
    .module('app.common')
    .component('passwordConfirm', {
        template: '<input type="text" ng-change="$ctrl.test()" ng-model="$ctrl.passwordConfirm" class="form-control">',
        controller: passwordConfirmController,
        bindings: {
            password: '<'
        }
    });

function passwordConfirmController() {
    var $ctrl = this;

    $ctrl.test = function () {
        console.log('test111', $ctrl, $ctrl.passwordConfirm);


    }
}
