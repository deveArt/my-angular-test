angular
    .module('app')
    .config(config);

function config($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider
        .when('/', {
            templateUrl: '/app/main/views/home.html'
        })
        .when('/login', {
            templateUrl: '/app/auth/views/login.html'
        })
        .when('/translations', {
            templateUrl: '/app/translations/views/translations.html'
        })
        .when('/registration', {
            templateUrl: '/app/auth/views/registration.html'
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
