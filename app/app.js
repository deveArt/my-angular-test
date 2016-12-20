'use strict';
angular
    .module('app', ['ngRoute'])
    .config(['$routeProvider', '$locationProvider', '$sceDelegateProvider', config]);

function config($routeProvider, $locationProvider, $sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['self', '*']);

    $routeProvider
        .when('/', {
            controller: 'mainCtrl',
        })
        .when('/login', {
            templateUrl: '/app/auth/views/login.html',
            controller: 'loginCtrl',
        });

    $locationProvider.html5Mode(true);
}
