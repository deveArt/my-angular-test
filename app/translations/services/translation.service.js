angular
    .module('app.translations')
    .service('translationService', translationService);

translationService.$inject = ['$http', '$q', 'storageService'];
function translationService($http, $q, storageService) {

    let options = {
        method: 'GET',
        url: 'http://dcodeit.net/angularTest/translation.php'
    };

    let self = this;

    init();

    self.getLangs = function () {
        let langs = ['eng', 'rus', 'de', 'no', 'it', 'sv'];

        return $q(function (resolve, reject) {
            resolve(langs);
        });
    };

    self.load = function(selectedLang) {
        options.params = {lang : selectedLang};

        return $http(options).then(function (response) {
            self.setLocal(selectedLang, response.data);
            return response.data;
        });
    };

    function init() {
        angular.extend(self, storageService);
    }
}
