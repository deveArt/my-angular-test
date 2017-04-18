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

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

}
