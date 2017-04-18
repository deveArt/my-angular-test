'use strict';
angular
    .module('app', [
        /* shared module */
        'app.common',
        /* feature modules */
        'app.main',
        'app.auth',
        'app.search',
        'app.translations',
        'app.users',
        'app.notes'
    ]);
