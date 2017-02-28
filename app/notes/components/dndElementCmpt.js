function DndElementController($window, $document, $element, $timeout, $scope, $attrs) {
    var $ctrl = this;


console.log($element);

    $element.on('click', function (e) {
        $ctrl.dndZone.dragElement = $element;
        $ctrl.dndZone.startX = e.pageX;
        $ctrl.dndZone.startY = e.pageY;

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
