'use strict';
angular
    .module('app', ['ngRoute', 'ngCookies', 'ngMessages'])
    .config(['$routeProvider', '$locationProvider', '$httpProvider', config])
    .run(function($rootScope) {
        $rootScope.color = 'success';
    });

function config($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider
        .when('/', {
            templateUrl: '/app/views/home.html'
       //     controller: 'mainCtrl',
       //     controllerAs: 'main'
        })
        .when('/login', {
            templateUrl: '/app/views/login.html'
        })
        .when('/translations', {
            templateUrl: '/app/views/translations.html'
        })
        .when('/registration', {
            templateUrl: '/app/views/registration.html'
        })
        .when('/users', {
            templateUrl: '/app/users/views/users.html',
            controller: 'usersCtrl',
            controllerAs: 'vm'
        })
        .when('/users/:id', {
            templateUrl: '/app/users/views/users.html',
            controller: 'usersCtrl',
            controllerAs: 'vm'
        })
        .when('/search', {
            templateUrl: '/app/search/views/search.html',
            controller: 'searchCtrl',
            controllerAs: 'vm'
        })
        .when('/notes', {
            templateUrl: '/app/notes/views/notes.html',
            controller: 'notesCtrl',
            controllerAs: 'vm'
        })
        .otherwise({redirectTo:'/'});

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    //$locationProvider.html5Mode(true);
}
