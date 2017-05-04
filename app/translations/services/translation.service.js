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
    self.getLangs = getLangs;
    self.load = load;

    init();

    function init() {
        angular.extend(self, storageService);
    }

    function load(selectedLang) {
        options.params = {lang : selectedLang};

        return $http(options).then(function (response) {
            self.setLocal(selectedLang, response.data);
            return response.data;
        });
    }

    function getLangs() {
        let langs = ['eng', 'rus', 'de', 'no', 'it', 'sv'];

        return $q(function (resolve, reject) {
            resolve(langs);
        });
    }
}
