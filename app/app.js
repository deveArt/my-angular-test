'use strict';
angular
    .module('app', [
      /* shared module */
      'app.common',
      /* feature modules */
      'app.auth',
      'app.search',
      'app.translations',
      'app.users',
      'app.notes'
    ])
    .run(function($rootScope) {
        $rootScope.color = 'success';
    });
