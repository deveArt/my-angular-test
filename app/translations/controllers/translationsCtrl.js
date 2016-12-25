var injectParams = ['$cookies', '$http'];

var TranslationsController = function($cookies, $http) {

    var vm = this;

    init();

    function init() {
        $http.get('http://dcodeit.net/angularTest/translation.php?lang=de').then(function (response) {
            console.log(response);
        }).catch(function (error) {
            console.error(error);
        });
    }
};

TranslationsController.$inject = injectParams;
angular.module('app').controller('translationsCtrl', TranslationsController);
