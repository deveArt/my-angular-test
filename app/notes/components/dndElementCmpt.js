function DndElementController($window, $document, $element, $timeout, $scope, $attrs) {
    var $ctrl = this;

    $ctrl.$onInit = init;

    function init() {
        $element.on('mousedown', function (e) {

            $ctrl.dndZone.dragTarget = {
                dragElement: $element,
                startX: e.pageX,
                startY: e.pageY
            };
            
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
