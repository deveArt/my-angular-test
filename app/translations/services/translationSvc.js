var injectParams = ['$http'];

var translationService = function ($http) {

    var options = {
        method: 'GET',
        url: 'http://dcodeit.net/angularTest/translation.php',
        transformResponse: function(obj) {
            return JSON.stringify(obj);
        }
    };

    this.getLocal = function (selectedLang) {
        var translations = localStorage.getItem(selectedLang);
        return (translations ? JSON.parse(JSON.parse(translations)) : null);
    };

    this.load = function (selectedLang, cb) {
        options.params = {lang : selectedLang};

        $http(options).then(function (response) {
            localStorage.setItem(selectedLang, response.data);
            cb(JSON.parse(response.data));
        }).catch(function (err) {
            console.error(err);
        });
    };
};

translationService.$inject = injectParams;
angular.module('app').service('translationSvc', translationService);
