angular
    .module('app.translations')
    .component('translations', {
        controller: TranslationsController,
        templateUrl: '/app/translations/translations.component.tmpl.html'
    });

TranslationsController.$inject = ['translationService'];
function TranslationsController(translationService) {

    var $ctrl = this;

    $ctrl.curLang = 'eng';
    $ctrl.pageWords = {};
    $ctrl.switch = switchLang;

    init();

    function init() {
        translationService.getLangs().then(function (langs) {
            $ctrl.langs = langs;
        }).catch(function (err) {
            console.log(err);
        });

        $ctrl.switch();
    }

    function switchLang() {
        $ctrl.pageWords = translationService.getLocal($ctrl.curLang);
        if ($ctrl.pageWords === null) {
            translationService.load($ctrl.curLang).then(function (data) {
                $ctrl.pageWords = data;
            })
            .catch(function (err) {
                console.log(err);
            });
        }
    }

}
