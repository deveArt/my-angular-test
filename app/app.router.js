angular
    .module('app')
    .config(config);

config.$inject = ['$locationProvider', '$httpProvider', '$stateProvider'];
function config($locationProvider, $httpProvider, $stateProvider) {

    $stateProvider
        .state('app', {
            url: '',
            abstract: true,
            views: {
                'header': {
                    component: 'navBar'
                },
                'footer': {
                    template: '2017'
                }
            }
        });


	//
    // $routeProvider
    //     .when('/', {
    //         templateUrl: '/app/main/views/main.component.tmpl.html'
    //     })
    //     .when('/login', {
    //         templateUrl: '/app/auth/views/login.html'
    //     })
    //     .when('/translations', {
    //         templateUrl: '/app/translations/views/translations.html'
    //     })
    //     .when('/registration', {
    //         templateUrl: '/app/auth/views/registration.html'
    //     })
    //     .when('/users', {
    //         templateUrl: '/app/users/views/users.html',
    //         controller: 'usersCtrl',
    //         controllerAs: 'vm'
    //     })
    //     .when('/users/:id', {
    //         templateUrl: '/app/users/views/users.html',
    //         controller: 'usersCtrl',
    //         controllerAs: 'vm'
    //     })
    //     .when('/search', {
    //         templateUrl: '/app/search/views/search.html',
    //         controller: 'searchCtrl',
    //         controllerAs: 'vm'
    //     })
    //     .when('/notes', {
    //         templateUrl: '/app/notes/views/notes.html',
    //         controller: 'notesCtrl',
    //         controllerAs: 'vm'
    //     })
    //     .otherwise({redirectTo:'/'});

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    //$locationProvider.html5Mode(true);
}
