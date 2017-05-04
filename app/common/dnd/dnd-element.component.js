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

        $element.on('mousedown', onMouseDown);

        function onMouseDown(e) {
            if (e.which != 1) { // не левой кнопкой
                return false;
            }

            $ctrl.dndZone.dragTarget = {
                dragElement: $element,
                startX: e.pageX,
                startY: e.pageY
            };

        }
    }
}
