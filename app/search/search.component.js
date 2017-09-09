angular
    .module('app.search')
    .component('search', {
        controller: SearchController,
        templateUrl: '/app/search/search.component.tmpl.html'
    });

SearchController.$inject = ['$http', 'globalVars', '$filter'];
function SearchController($http, globalVars, $filter) {

    const listUrl = 'http://dcodeit.net/angularTest/data.json';

    var $ctrl = this;

    $ctrl.globalVars = globalVars.data;
    $ctrl.data = [];
    $ctrl.searchWord = '';
    $ctrl.curFields = angular.copy($filter('searchFilter').fields);
    $ctrl.insens = true;
    $ctrl.exact = false;
    $ctrl.load = load;
    init();

    function init() {
        load().then(function (response) {
            $ctrl.data = response.data;
        }).catch(function (err) {
            console.error(err);
        });
    }

    function load() {
        return $http.get(listUrl);
    }
}
