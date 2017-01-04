var injectParams = ['$http', '$q'];

var translationService = function ($http, $q) {

    var options = {
        method: 'GET',
        url: 'http://dcodeit.net/angularTest/translation.php',
    };

    var self = this;

    self.getLangs = function () {
        var langs = ['eng', 'rus', 'de', 'no', 'it', 'sv'];

        return $q(function (resolve, reject) {
            resolve(langs);
        });
    };

    self.getLocal = function(selectedLang) {
        var translations = localStorage.getItem(selectedLang);
        return (translations ? JSON.parse(translations) : null);
    };

    self.load = function(selectedLang) {
        options.params = {lang : selectedLang};

        return $http(options).then(function (response) {
            localStorage.setItem(selectedLang, JSON.stringify(response.data));
            return response.data;
        });
    };

};

translationService.$inject = injectParams;
angular.module('app').service('translationSvc', translationService);
