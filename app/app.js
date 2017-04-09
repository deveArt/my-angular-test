'use strict';
angular
    .module('app', ['ngRoute', 'ngCookies', 'ngMessages'])
    .run(function($rootScope) {
        $rootScope.color = 'success';
    });
