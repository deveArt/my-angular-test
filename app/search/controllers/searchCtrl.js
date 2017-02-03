angular
    .module('app')
    .controller('searchCtrl', SearchController);

SearchController.$inject = ['$http'];
function SearchController($http) {

    const listUrl = 'http://dcodeit.net/angularTest/data.json';

    var vm = this;
    vm.searchFields = {
        '': 'all',
        'Name': 'Name',
        'Type': 'Type',
        'Designed by': 'Designed by'
    };

    vm.data = [];
    vm.searchWord = '';
    vm.curFields = '';
    vm.insens = true;

    init();
    
    function init() {
        $http.get(listUrl).then(function (response) {
            vm.data = response.data;console.log(response);
        }).catch(function (err) {
            console.error(err);
        });
    }
}
