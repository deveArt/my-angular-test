var injectParams = ['authSvc', '$cookies', '$rootScope', '$location'];

var MainController = function (authSvc, $cookies, $rootScope, $location) {

    var vm = this;

    vm.color = '';
    vm.themes = ['red', 'blue', 'orange']; ////////////

    vm.location = $location.path();
    vm.logout = function () {
        authSvc.logout().then(function (response) {
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

    init();

    function init() {
        $rootScope.$on('$routeChangeSuccess', function() {
            vm.location = $location.path();
        });
    }
};

MainController.$inject = injectParams;
angular.module('app').controller('mainCtrl', MainController);
