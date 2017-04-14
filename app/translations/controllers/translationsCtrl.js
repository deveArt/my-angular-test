angular
    .module('app')
    .controller('translationsCtrl', TranslationsController);

TranslationsController.$inject = ['translationService'];
function TranslationsController(translationService) {

    var vm = this;

    vm.curLang = 'eng';
    vm.pageWords = {};
    vm.switch = switchLang;

    init();

    function init() {
        translationService.getLangs().then(function (langs) {
            vm.langs = langs;
        }).catch(function (err) {
            console.log(err);
        });

        vm.switch();
    }

    function switchLang() {
        vm.pageWords = translationService.getLocal(vm.curLang);
        if (vm.pageWords === null) {
            translationService.load(vm.curLang).then(function (data) {
                vm.pageWords = data;
            })
            .catch(function (err) {
                console.log(err);
            });
        }
    }

}
