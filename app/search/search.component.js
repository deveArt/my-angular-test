angular
    .module('app.search')
    .component('search', {
        controller: SearchController,
        templateUrl: '/app/search/search.component.tmpl.html'
    });

SearchController.$inject = ['$http'];
function SearchController($http) {

    const listUrl = 'http://dcodeit.net/angularTest/data.json';

    var $ctrl = this;

    $ctrl.data = [];
    $ctrl.searchWord = '';
    $ctrl.curFields = {
        Name: false,
        Type: false,
        'Designed by': false
    };
    $ctrl.insens = true;
    $ctrl.exact = false;
    init();

    function init() {
        $http.get(listUrl).then(function (response) {
            $ctrl.data = response.data;
        }).catch(function (err) {
            console.error(err);
        });
    }
}
