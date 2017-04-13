function navbarController() {
    var ctrl = this;
}

angular
    .module('app')
    .component('navbar', {
        templateUrl: '/app/main/views/navbar.html',
        controller: navbarController,
        bindings: {
            location: '<'
        }
    });
