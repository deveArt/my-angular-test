'use strict';
angular
    .module('app', ['ngRoute', 'ngCookies'])
    .config(['$routeProvider', '$locationProvider', '$httpProvider', config]);

function config($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider
        .when('/', {
            templateUrl: '/app/views/home.html'
        })
        .when('/login', {
            templateUrl: '/app/views/login.html',
        })
        .when('/translations', {
            templateUrl: '/app/views/translations.html',
        })
        .otherwise({redirectTo:'/'});

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $locationProvider.html5Mode(true);
}
