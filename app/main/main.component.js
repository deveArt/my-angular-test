angular
    .module('app.main')
    .component('main', {
        controller: MainController,
        templateUrl: '/app/main/main.component.tmpl.html'
    });

MainController.$inject = ['authService', '$cookies', '$rootScope', '$location'];
function MainController(authService, $cookies, $rootScope, $location) {

    var vm = this;

    vm.themes = [
        {name: 'primary', val: 'Dark blue'},
        {name: 'success', val: 'Green'},
        {name: 'info', val: 'Blue'},
        {name: 'warning', val:'Yellow'},
        {name: 'danger', val: 'Red'},
        {name: 'grey', val: 'Grey'},
        {name: 'codeit', val:'CodeIT'},
        {name: 'dark-red', val: 'Dark red'}
    ];

    vm.location = $location.path();
    vm.logout = function () {
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
