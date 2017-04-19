angular
    .module('app.main')
    .component('main', {
        controller: MainController,
        templateUrl: '/app/main/main.component.tmpl.html'
    });

MainController.$inject = ['authService', '$cookies', '$rootScope', '$location', 'globalVars'];
function MainController(authService, $cookies, $rootScope, $location, globalVars) {

    var $ctrl = this;

    $ctrl.globalVars = globalVars.data;
    $ctrl.location = $location.path();
    $ctrl.logout = function () {
        authService.logout().then(function (response) {
            if (!response.data.errors) {
                console.log($cookies.getAll());
                $rootScope.loggedIn = false;
                $location.path( "/login" );
            }

            console.log(response.data);
        }).catch(function (error) {
            console.error(error);
        });
    };

}
