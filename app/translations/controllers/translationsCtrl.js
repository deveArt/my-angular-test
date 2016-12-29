var injectParams = ['translationSvc', '$http', '$scope'];

var TranslationsController = function(translationSvc, $http, $scope) {

    var vm = this;

    vm.lang = 'eng';
    vm.translations = translationSvc.translations;
    vm.pageWords = [
        'button cancel',
        'button save',
        'form_title',
        'main text',
        'sample1',
        'sample2',
        'sample3',
        'title'
    ];

    console.log(vm.translations.data);
    console.log(translationSvc.translations.data);
    vm.test = function () {
        console.log(vm.translations.data);
        console.log(translationSvc.translations.data);
    }
};

TranslationsController.$inject = injectParams;
angular.module('app').controller('translationsCtrl', TranslationsController);
