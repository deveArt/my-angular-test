function DndElementController($window, $document, $element, $timeout, $scope, $attrs) {
    var $ctrl = this;


console.log($element);

    $element.on('mousedown', function (e) {

        var dragTarget = {
            dragElement: $element,
            startX: e.pageX,
            startY: e.pageY
        };

        $ctrl.dndZone.dragTarget = dragTarget;

        console.dir($ctrl.dndZone);
    });
    $ctrl.$postLink = init;

    function init() {
        
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
