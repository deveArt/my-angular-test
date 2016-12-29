var injectParams = ['translationSvc'];

var translateFilter = function (translationSvc) {
    var translations = translationSvc.translations.data;
    return function (word) {
        return translations !== null && translations[word] !== undefined ? translations[word] : word;
    };
};

translateFilter.$inject = injectParams;
angular.module('app').filter('translateFilter', translateFilter);