angular
    .module('app.common')
    .component('navBar', {
        templateUrl: '/app/common/nav-bar/nav-bar.component.tmpl.html',
        controller: NavbarController,
        bindings: {
            location: '<'
        }
    });

NavbarController.$inject = ['$state'];

function NavbarController($state) {
    var $ctrl = this;

    $ctrl.states = $state.get().filter(state => !state.abstract);
    $ctrl.isActive = isActive;
    $ctrl.goTo = goTo;

    function goTo(state) {
        return $state.go(state);
    }

    function isActive(state) {
        return $state.includes(state);
    }
}
