angular
    .module('app.common')
    .component('dndElement', {
        controller: DndElementController,
        require: {
            dndZone: '^^dndZone'
        }
    });

DndElementController.$inject = ['$element'];

function DndElementController($element) {
    var $ctrl = this;

    $ctrl.$onInit = init;

    function init() {

    }
}
