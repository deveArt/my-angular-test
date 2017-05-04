angular
    .module('app.common')
    .component('navBar', {
        templateUrl: '/app/common/nav-bar/nav-bar.component.tmpl.html',
        controller: NavbarController,
        bindings: {
            location: '<'
        }
    });

NavbarController.$inject = ['$state', 'globalVars', 'authService', '$cookies'];

function NavbarController($state, globalVars, authService, $cookies) {
    var $ctrl = this;

    $ctrl.states = $state.get().filter(state => !state.abstract);
    $ctrl.isActive = isActive;
    $ctrl.goTo = goTo;
    $ctrl.globalVars = globalVars.data;

    function goTo(state) {
        return $state.go(state);
    }

    function isActive(state) {
        return $state.includes(state);
    }

    $ctrl.logout = logout;

    function logout() {
        authService.logout().then(function (response) {
            if (!response.data.errors) {
                //console.log($cookies);
                globalVars.setVar('loggedIn', false);
                goTo("app.login");
            }

            console.log(response.data);
        }).catch(function (error) {
            console.error(error);
        });
    }
}
