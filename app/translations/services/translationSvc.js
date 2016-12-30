var injectParams = ['$http', '$q'];

var translationService = function ($http, $q) {

    var options = {
        method: 'GET',
        url: 'http://dcodeit.net/angularTest/translation.php',
    };

    var self = this;
    self.translations = {
        data: {},
        curLang: 'eng',
    };

    self.getLangs = function () {
        var langs = ['eng', 'rus', 'de', 'no', 'it', 'sv'];

        return $q(function (resolve, reject) {
            resolve(langs);
        });
    };

    init();

    function getLocal (selectedLang) {
        var translations = localStorage.getItem(selectedLang);
        return (translations ? JSON.parse(translations) : null);
    }

    function load (selectedLang) {
        options.params = {lang : selectedLang};

        return $http(options).then(function (response) {
            localStorage.setItem(selectedLang, JSON.stringify(response.data));
            return response.data;
        });
    }

    function init () {
        self.translations.data = getLocal(self.translations.curLang);

        if (self.translations.data === null) {
            load(self.translations.curLang).then(function (result) {
                self.translations.data = result;
            }).catch(function (err) {
                console.error(err);
            })
        }
    }

};

translationService.$inject = injectParams;
angular.module('app').service('translationSvc', translationService);
