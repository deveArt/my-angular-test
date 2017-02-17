function DragndropController($window, $document, $element, $timeout, $scope, $attrs) {
    var $ctrl = this;

console.log($element);
console.dir($element);
}

angular
    .module('app')
    .component('dragndrop', {
        controller: DragndropController,
        bindings: {
            selvalue: '=',
            list: '<'
        }
    });
