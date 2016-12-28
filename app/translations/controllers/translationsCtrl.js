var injectParams = ['translationSvc', '$http'];

var TranslationsController = function(translationSvc, $http) {

    var vm = this;

    vm.lang = 'eng';
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

    init();

    function init() {
        vm.translations = translationSvc.getLocal(vm.lang);

        if (!vm.translations) {
            translationSvc.load(vm.lang)
                .then(function (data) {
                    vm.translations = data;
                })
                .catch(function (err) {
                    console.error(err);
                });
        }
    }

    vm.test = function () {
        console.log(vm.translations);
    }
};

TranslationsController.$inject = injectParams;
angular.module('app').controller('translationsCtrl', TranslationsController);
