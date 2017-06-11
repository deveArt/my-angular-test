angular
    .module('app.common')
    .component('dndZone', {
        controller: DndZoneController,
        templateUrl: '/app/common/dnd/dnd-zone.component.tmpl.html',
        bindings: {
            mode: '@',
            onStart: '&',
            onEnd: '&'
        }
    });

DndZoneController.$inject = ['$document', '$element', 'geometryService', 'dndData'];

/**
 *
 * Dnd zone controller
 * dnd flow manage
 *
 * @constructor
 */
function DndZoneController($document, $element, geometryService, dndData) {
    var $ctrl = this;
    $ctrl.dndElements = [];
    $ctrl.zone = {};
    $ctrl.onMouseDown = onMouseDown;
    $ctrl.onMouseMove = onMouseMove;
    $ctrl.onMouseUp = onMouseUp;
    $ctrl.onMouseEnter = onMouseEnter;
    $ctrl.onMouseLeave = onMouseLeave;
    $ctrl.dragTarget = null;
    $ctrl._elem = null; //html of drag element

    $ctrl.$postLink = init;

    /**
     * Main setup
     */
    function init() {
        $ctrl.state = dndData.getState();
        $ctrl.zone = dndData.register($element);
        $ctrl.zone.mode = $ctrl.mode;
        $ctrl.dndElements = $ctrl.zone.dndElements;
    }

    function onMouseDown(event, i) {
        if (event.which != 1) { // не левой кнопкой
            return false;
        }

        $ctrl.eid = i;
        $ctrl.dragTarget = {
            dragElement: event.currentTarget,
            startX: event.pageX,
            startY: event.pageY
        };
    }

    function onMouseEnter(i) {
        $ctrl.dndElements[i].target = $ctrl.zone.id !== 0;
    }
    
    function onMouseLeave(i) {
        $ctrl.dndElements[i].target = false;
    }
    
    function onMouseMove(event) {
        
        if (!$ctrl.dragTarget) {
            return;
        }

        if (Math.abs(event.pageX - $ctrl.dragTarget.startX) < 3 && Math.abs(event.pageY - $ctrl.dragTarget.startY) < 3) {
            return;
        }

        if ( $ctrl._elem === null ) {
            $ctrl.onStart && $ctrl.onStart();

            $ctrl._elem = $ctrl.dragTarget.dragElement;
            let coords = geometryService.getCoords($ctrl._elem);
            dragStart(coords);
        }

        onDragMove(event);

        let newDropTarget = findDropTarget(event);

        if (newDropTarget !== $ctrl.dropTarget) {
            $ctrl.dropTarget && targetLightOff($ctrl.dropTarget);
            newDropTarget && targetLightOn(newDropTarget);
        }

        $ctrl.dropTarget = newDropTarget;
    }

    function onMouseUp(event) {

        if (event.which != 1) { // не левой кнопкой
            return false;
        }
        if (!$ctrl.dragTarget) {
            return;
        }

        if ($ctrl._elem) {
            console.log($ctrl.dropTarget);
            if ($ctrl.dropTarget) {
                dragEnd();
            } else {
                rollBack();
            }
        }

        $ctrl.eid = null;

        $ctrl.dragTarget = null;
        $ctrl._elem = null;
        $ctrl.dropTarget = null;
    }

    /**
    * Revert move actions
    *
    **/
    function rollBack() {
        console.log('rollback');

        $ctrl.dndElements[$ctrl.eid].style = {};
        $ctrl.onEnd && $ctrl.onEnd();
    }

    /**
     * Start drag. Save old position. Move element to body scope.
     *
     **/
    function dragStart(coords) {
        if (!$ctrl.dragTarget) {
            return;
        }
        console.log('drag start');

        // создать вспомогательные свойства shiftX/shiftY

        $ctrl._margin = parseInt(getComputedStyle($ctrl._elem, null).getPropertyValue('margin'));

        $ctrl._shiftX = $ctrl.dragTarget.startX - coords.left;
        $ctrl._shiftY = $ctrl.dragTarget.startY - coords.top;

        $ctrl.dndElements[$ctrl.eid].style.zIndex = 100;
        $ctrl.dndElements[$ctrl.eid].style.position = 'absolute';

        return true;
    }

    /**
     * Move element following the cursor
     *
     **/
    function onDragMove(event) {
        $ctrl._elemX = event.pageX - $ctrl._shiftX; //$ctrl._shiftX;
        $ctrl._elemY = event.pageY - $ctrl._shiftY; //$ctrl._shiftY;

        $ctrl.dndElements[$ctrl.eid].style.left = $ctrl._elemX - $ctrl.zone.left - $ctrl._margin + 'px';
        $ctrl.dndElements[$ctrl.eid].style.top = $ctrl._elemY - $ctrl.zone.top - $ctrl._margin + 'px';
    }

    /**
     * End of drag action. Append to target zone. Position adjustment.
     *
     **/
    function dragEnd() {
        if ($ctrl.dropTarget == null) {
            return null;
        }
        console.log('drag end');
        targetLightOff($ctrl.dropTarget);

        if ($ctrl.dropTarget.mode === 'trash') {
            dndData.deleteElement($ctrl.eid, $ctrl.zone.id);
        } else {
            let coordsEl = geometryService.getCoords($ctrl._elem);

            let diffLeft = $ctrl.dropTarget.left - coordsEl.left + 10;
            let diffTop = $ctrl.dropTarget.top - coordsEl.top + 10;
            let diffRight = $ctrl.dropTarget.right - coordsEl.right - 10;
            let diffBottom = $ctrl.dropTarget.bottom - coordsEl.bottom - 10;

            let left = $ctrl._elemX - $ctrl.dropTarget.left - $ctrl._margin;
            let top = $ctrl._elemY - $ctrl.dropTarget.top - $ctrl._margin;

            if ($ctrl.dropTarget.left > coordsEl.left) {
                left += diffLeft;
            }

            if ($ctrl.dropTarget.top > coordsEl.top) {
                top += diffTop;
            }

            if ($ctrl.dropTarget.bottom < coordsEl.bottom) {
                top += diffBottom;
            }

            if ($ctrl.dropTarget.right < coordsEl.right) {
                left += diffRight;
            }

            $ctrl.dndElements[$ctrl.eid].style.left = left + 'px';
            $ctrl.dndElements[$ctrl.eid].style.top = top + 'px';
            dndData.moveElement($ctrl.eid, $ctrl.zone.id, $ctrl.dropTarget.id);
        }

        $ctrl.onEnd && $ctrl.onEnd();
    }

    /**
     * Find drop zone
     *
     **/
    function findDropTarget(event) {

        let zones = dndData.getDropable();

        return zones.find(zone =>
            event.pageX > zone.left &&
            event.pageX < zone.right &&
            event.pageY > zone.top &&
            event.pageY < zone.bottom
        );
    }

    function targetLightOn(dropTarget) {
        dropTarget.light = true;
    }

    function targetLightOff(dropTarget) {
        dropTarget.light = false;
    }
}
