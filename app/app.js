angular
    .module('app', ['ngRoute'])
    .config(['$routeProvider', '$locationProvider', '$sceDelegateProvider', config]);

function config($routeProvider, $locationProvider, $sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://localhost/app/**']);

    $routeProvider
        .when('/login', {
            templateUrl: 'http://localhost/app/auth/view/login.html',
            controller: 'loginCtrl',
            controllerAs: 'vm'
        });

    $locationProvider.html5Mode(true);
}