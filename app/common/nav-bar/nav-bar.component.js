function NavbarController() {

}

angular
    .module('app.common')
    .component('navBar', {
        templateUrl: '/app/common/nav-bar/nav-bar.component.tmpl.html',
        controller: NavbarController,
        bindings: {
            location: '<'
        }
    });
