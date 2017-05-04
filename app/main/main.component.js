angular
    .module('app.main')
    .component('main', {
        controller: MainController,
        templateUrl: '/app/main/main.component.tmpl.html'
    });

MainController.$inject = ['globalVars'];
function MainController(globalVars) {

    var $ctrl = this;

    $ctrl.globalVars = globalVars.data;

}
