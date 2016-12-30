var injectParams = ['translationSvc', '$http', '$scope', '$timeout'];

var TranslationsController = function(translationSvc, $http, $scope, $timeout) {

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
///////////////////////////////////////////////////////
    $scope.$watch(function() {
        return translationSvc.translations.data;
    }, function(value, oldValue) {

     $timeout(function() {
      $scope.$apply();
       // anything you want can go here and will safely be run on the next digest.
     });

        $scope.$$phase || $scope.$apply();
    });
};

TranslationsController.$inject = injectParams;
angular.module('app').controller('translationsCtrl', TranslationsController);
