angular
    .module('app')
    .controller('translationsCtrl', TranslationsController);

TranslationsController.$inject = ['translationSvc'];
function TranslationsController(translationSvc) {

    var vm = this;

    vm.curLang = 'eng';
    vm.pageWords = {};
    vm.switch = switchLang;

    init();

    function init() {
        translationSvc.getLangs().then(function (langs) {
            vm.langs = langs;
        }).catch(function (err) {
            console.log(err);
        });

        vm.switch();
    }

    function switchLang() {
        vm.pageWords = translationSvc.getLocal(vm.curLang);
        if (vm.pageWords === null) {
            translationSvc.load(vm.curLang).then(function (data) {
                vm.pageWords = data;
            })
            .catch(function (err) {
                console.log(err);
            });
        }
    }

}
