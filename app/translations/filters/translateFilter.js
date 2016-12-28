var translateFilter = function () {

    return function (word, translations) {
        return translations !== null && translations[word] !== undefined ? translations[word] : word;
    };
};

angular.module('app').filter('translateFilter', translateFilter);