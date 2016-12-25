'use strict';
angular
    .module('app', ['ngRoute', 'ngCookies'])
    .config(['$routeProvider', '$locationProvider', '$sceDelegateProvider', '$httpProvider', config]);

function config($routeProvider, $locationProvider, $sceDelegateProvider, $httpProvider) {
    //$sceDelegateProvider.resourceUrlWhitelist(['self', '*']);

    $routeProvider
        .when('/', {//////////////&&&&&??????????????????
            controller: 'mainCtrl'
        })
        .when('/login', {
            templateUrl: '/1app/views/login.html',
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
