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
    $ctrl.onMouseDown = onMouseDown;
    $ctrl.onMouseMove = onMouseMove;
    $ctrl.onMouseUp = onMouseUp;

    $ctrl.dragTarget = null;
    $ctrl._elem = null;

    $ctrl.$postLink = init;

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

        onDragMove(event);return;

        let newDropTarget = findDropTarget();

        if (newDropTarget != $ctrl._dropTarget) {
            $ctrl._dropTarget && angular.element($ctrl._dropTarget).triggerHandler('dragleave');
            newDropTarget && angular.element(newDropTarget).triggerHandler('dropready');
        }

        $ctrl._dropTarget = newDropTarget;
    }

    function onMouseUp(event) {

        if (event.which != 1) { // не левой кнопкой
            return false;
        }
        if (!$ctrl.dragTarget) {
            return;
        }

        if ($ctrl._elem) {
            console.log($ctrl._dropTarget);
            if ($ctrl._dropTarget) {
                dragEnd();
            } else {
                rollBack();
            }
        }

        $ctrl.eid = null;

        $ctrl.dragTarget = null;
        $ctrl._elem = null;
        $ctrl._dropTarget = null;
        $ctrl.old = null;
    }

	/**
     * Main setup listeners
     */
    function init() {
        $element[0].mode = $ctrl.mode;

        $ctrl.dndElements = dndData.register();

        let zoneCoords = geometryService.getCoords($element);

        $ctrl.zoneX = zoneCoords.left;
        $ctrl.zoneY = zoneCoords.top;

        if ($ctrl.mode !== 'drag') {
            $element.on('dropready', function (e) {
                $element.css({'background-color': '#27ae60'});
                console.log('ready to drop');
            });
            $element.on('dragleave', function (e) {
                $element.css({'background-color': null});
                console.log('drag el left');
            });
        }

//        $document.on('mousemove', onMouseMove);
//        $document.on('mouseup', onMouseUp);



    }

    /**
    * Revert move actions
    *
    **/
    function rollBack() {
        console.log('rollback');

       // $ctrl.dndElements[$ctrl.eid].style = {};

        // $ctrl.old.parent.insertBefore($ctrl._elem, $ctrl.old.nextSibling);
        //
        // let coords = geometryService.getCoords($ctrl.old.parent);
        // $ctrl._elem.style.position = $ctrl.old.position;
        // $ctrl._elem.style.left = $ctrl.old.left - coords.left - $ctrl._margin + 'px';
        // $ctrl._elem.style.top = $ctrl.old.top - coords.top - $ctrl._margin + 'px';
        // $ctrl._elem.style.zIndex = $ctrl.old.zIndex;

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

        $ctrl.old = {
            parent: $ctrl._elem.parentNode,
            nextSibling: $ctrl._elem.nextSibling,
            position: $ctrl._elem.style.position || '',
            left: coords.left || '',
            top: coords.top || '',
            zIndex: $ctrl._elem.style.zIndex || ''
        };

        $ctrl.dndElements[$ctrl.eid].style.zIndex = 100;
        $ctrl.dndElements[$ctrl.eid].style.position = 'absolute';

        // Old

        // document.body.appendChild($ctrl._elem);
        // $ctrl._elem.style.zIndex = 20;
        // $ctrl._elem.style.position = 'absolute';


        return true;
    }

    /**
    * Move element following the cursor
    *
    **/
    function onDragMove(event) {

        $ctrl._elemX = event.pageX - $ctrl._shiftX; //$ctrl._shiftX;
        $ctrl._elemY = event.pageY - $ctrl._shiftY; //$ctrl._shiftY;

        $ctrl.dndElements[$ctrl.eid].style.left = $ctrl._elemX - $ctrl.zoneX - $ctrl._margin + 'px';
        $ctrl.dndElements[$ctrl.eid].style.top = $ctrl._elemY - $ctrl.zoneY - $ctrl._margin + 'px';

//         console.log($ctrl._elemX);
//         console.log($ctrl._elemY);
//
// console.log($ctrl.dndElements[$ctrl.eid].style.left);
// console.log($ctrl.dndElements[$ctrl.eid].style.top);

        $ctrl._currentTargetElem = geometryService.getElementUnderClientXY($ctrl._elem, event.clientX, event.clientY);
    }

    /**
    * End of drag action. Append to target zone. Position adjustment.
    *
    **/
    function dragEnd() {
        if ($ctrl._dropTarget == null) {
            return null;
        }
        console.log('drag end');
        angular.element($ctrl._dropTarget).triggerHandler('dragleave');

        if ($ctrl._dropTarget.mode === 'trash') {
            angular.element($ctrl._elem).remove();
        } else {
            let coordsEl = geometryService.getCoords($ctrl._elem);
            let coordsZone = geometryService.getCoords($ctrl._dropTarget);
            let diffLeft = coordsZone.left - coordsEl.left + 10;
            let diffTop = coordsZone.top - coordsEl.top + 10;
            let diffRight = coordsZone.right - coordsEl.right - 10;
            let diffBottom = coordsZone.bottom - coordsEl.bottom - 10;

            let left = $ctrl._elemX - coordsZone.left - $ctrl._margin;
            let top = $ctrl._elemY - coordsZone.top - $ctrl._margin;

            if (coordsZone.left > coordsEl.left) {
                left += diffLeft;
            }

            if (coordsZone.top > coordsEl.top) {
                top += diffTop;
            }

            if (coordsZone.bottom < coordsEl.bottom) {
                top += diffBottom;
            }

            if (coordsZone.right < coordsEl.right) {
                left += diffRight;
            }

            $ctrl._dropTarget.appendChild($ctrl._elem);
            $ctrl._elem.style.left = left + 'px';
            $ctrl._elem.style.top = top + 'px';
        }

        $ctrl.onEnd && $ctrl.onEnd();
    }

    /**
    * Find drop zone
    *
    **/
    function findDropTarget() {
        if (!$ctrl._currentTargetElem) {
            return null;
        }

        let elem = $ctrl._currentTargetElem;

        while (elem != document && elem.mode !== 'drop' && elem.mode !== 'trash') {
            elem = elem.parentNode;
        }

        if (elem == document) {
            return null;
        }

        return elem;
    }
}
