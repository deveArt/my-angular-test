angular
    .module('app.common')
    .component('resizable', {
        controller: ResizableController,
        bindings: {
            zid: '<',
            eid: '<'
        },
        template: '<div class="resize-control" ' +
        'ng-mousedown="$ctrl.onMouseDown($event)" ' +
        'ng-mousemove="$ctrl.resize($event)" ' +
        'ng-mouseup="$ctrl.onMouseUp()"></div>'
    });

ResizableController.$inject = ['$element', 'geometryService', 'dndData'];

/**
 * Resize controller
 *
 * @constructor
 */
function ResizableController($element, geometryService, dndData) {
    var $ctrl = this;

    $ctrl.$postLink = init;
    $ctrl.active = false;
    $ctrl.onMouseDown = onMouseDown;
    $ctrl.resize = onMouseMove;
    $ctrl.onMouseUp = onMouseUp;

    function init() {
        $ctrl._elem = $element.parent()[0];
        $ctrl.element = dndData.getElement($ctrl.eid, $ctrl.zid);
    }

    function onMouseMove(event) {
        if (!$ctrl.active || !$ctrl._elem) {
            return;
        }

        $ctrl.element.style.width = event.pageX + $ctrl.stWidth - $ctrl.cornerSX + 'px';
        $ctrl.element.style.height = event.pageY + $ctrl.stHeight - $ctrl.cornerSY + 'px';
    }

    function onMouseUp() {
        $ctrl.active = false;
    }

    function onMouseDown(event) {
        $ctrl.active = true;

        let position = geometryService.getCoords($ctrl._elem);

        $ctrl.stWidth = position.width;
        $ctrl.stHeight = position.height;
console.log($ctrl.stWidth);
        $ctrl.cornerSX = event.pageX;
        $ctrl.cornerSY = event.pageY;

        event.stopPropagation();
    }
}
