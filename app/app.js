'use strict';
angular
    .module('app', ['ngRoute'])
    .config(['$routeProvider', '$locationProvider', '$sceDelegateProvider', '$httpProvider', config]);

function config($routeProvider, $locationProvider, $sceDelegateProvider, $httpProvider) {
    //$sceDelegateProvider.resourceUrlWhitelist(['self', '*']);

    $routeProvider
        .when('/', {
            controller: 'mainCtrl'
        })
        .when('/login', {
            templateUrl: '/app/auth/views/login.html',
            controller: 'loginCtrl'
        });

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $locationProvider.html5Mode(true);
}
