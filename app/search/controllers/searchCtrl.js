angular
    .module('app')
    .controller('searchCtrl', SearchController);

SearchController.$inject = ['$http'];
function SearchController($http) {

    const listUrl = 'http://dcodeit.net/angularTest/data.json';

    var vm = this;

    vm.data = [];
    vm.searchWord = '';
    vm.curFields = {
        Name: false,
        Type: false,
        'Designed by': false
    };
    vm.insens = true;
    vm.exact = false;
    init();
    
    function init() {
        $http.get(listUrl).then(function (response) {
            vm.data = response.data;console.log(response);
        }).catch(function (err) {
            console.error(err);
        });
    }
}
