var injectParams = ['$http'];

var translationService = function ($http) {

    var options = {
        method: 'GET',
        url: 'http://dcodeit.net/angularTest/translation.php',
    };

    this.getLocal = function (selectedLang) {
        var translations = localStorage.getItem(selectedLang);
        return (translations ? JSON.parse(translations) : null);
    };

    this.load = function (selectedLang) {
        options.params = {lang : selectedLang};

        return $http(options).then(function(response) {
            localStorage.setItem(selectedLang, JSON.stringify(response.data));
            return response.data;
        });
    };
};

translationService.$inject = injectParams;
angular.module('app').service('translationSvc', translationService);
