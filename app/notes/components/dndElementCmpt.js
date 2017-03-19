function DndElementController($window, $document, $element, $timeout, $scope, $attrs) {
    var $ctrl = this;

    $ctrl.$onInit = init;

    function init() {
        $element.on('mousedown', function (e) {

            var dragTarget = {
                dragElement: $element,
                startX: e.pageX,
                startY: e.pageY
            };

            $ctrl.dndZone.dragTarget = dragTarget;

            console.dir($element);
        });
    }
}

angular
    .module('app')
    .component('dndElement', {
        controller: DndElementController,
        require: {
            dndZone: '^dndZone'
        }
    });
