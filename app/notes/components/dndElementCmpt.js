function DndElementController($window, $document, $element, $timeout, $scope, $attrs) {
    var $ctrl = this;

    $ctrl.$onInit = init;

    function init() {
console.log($scope);
        $element.on('mousedown', function (e) {
            if (e.which != 1) { // не левой кнопкой
                return false;
            }

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
            dndZone: '^^dndZone'
        }
    });
