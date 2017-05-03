angular
    .module('app.common')
    .component('dndZone', {
        controller: DndZoneController,
        template: '{{$ctrl.overlay}}<div id="dnd-overlay" ng-show="$ctrl.overlay"></div><button ng-click="$ctrl.highlight()">blabla</button>',
        bindings: {
            mode: '@',
            onStart: '&',
            onEnd: '&'
        }
    });

DndZoneController.$inject = ['$document', '$element', 'geometryService'];

/**
 *
 * Dnd zone controller
 * dnd flow manage
 *
 * @constructor
 */
function DndZoneController($document, $element, geometryService) {
    var $ctrl = this;
    $ctrl.dragTarget = null;
    $ctrl._elem = null;
    $ctrl.overlay = false;

    $ctrl.$postLink = init;

    $ctrl.highlight = function() {
        $ctrl.overlay = true;
    };

    $ctrl.nolight = function() {
        $ctrl.overlay = false;
    };

	/**
     * Main setup listeners
     */
    function init() {
        $element[0].mode = $ctrl.mode;

        if ($ctrl.mode !== 'drag') {
            $element.on('dropready', function (e) {
                $ctrl.highlight();
                console.log('ready to drop');
            });
            $element.on('dragleave', function (e) {
                $ctrl.nolight();
                console.log('drag el left');
            });
        }

        $document.on('mousemove', function (e) {
            if (!$ctrl.dragTarget) {
                return;
            }

            if (Math.abs(e.pageX - $ctrl.startX) < 3 && Math.abs(e.pageY - $ctrl.startY) < 3) {
                return;
            }

            if ( $ctrl._elem === null ) {
                $ctrl.onStart && $ctrl.onStart();
                dragStart();
            }

            onDragMove(e);

            let newDropTarget = findDropTarget();

            if (newDropTarget != $ctrl._dropTarget) {
                $ctrl._dropTarget && angular.element($ctrl._dropTarget).triggerHandler('dragleave');
                newDropTarget && angular.element(newDropTarget).triggerHandler('dropready');
            }

            $ctrl._dropTarget = newDropTarget;
        });

        $document.on('mouseup', function (e) {

            if (e.which != 1) { // не левой кнопкой
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

            $ctrl.dragTarget = null;
            $ctrl._elem = null;
            $ctrl._dropTarget = null;
            $ctrl.old = null;
        });
    }

    /**
    * Revert move actions
    *
    **/
    function rollBack() {
        console.log('rollback');

        $ctrl.old.parent.insertBefore($ctrl._elem, $ctrl.old.nextSibling);

        let coords = geometryService.getCoords($ctrl.old.parent);
        $ctrl._elem.style.position = $ctrl.old.position;
        $ctrl._elem.style.left = $ctrl.old.left - coords.left - $ctrl._margin + 'px';
        $ctrl._elem.style.top = $ctrl.old.top - coords.top - $ctrl._margin + 'px';
        $ctrl._elem.style.zIndex = $ctrl.old.zIndex;

        $ctrl.onEnd && $ctrl.onEnd();
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
    * Start drag. Save old position. Move element to body scope.
    *
    **/
    function dragStart() {
        if (!$ctrl.dragTarget) {
            return;
        }
        console.log('drag start');

        // создать вспомогательные свойства shiftX/shiftY
        $ctrl._elem = $ctrl.dragTarget.dragElement[0];
        $ctrl._margin = parseInt(getComputedStyle($ctrl._elem, null).getPropertyValue('margin'));

        let coords = geometryService.getCoords($ctrl._elem);
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

        console.dir($ctrl.old);
        document.body.appendChild($ctrl._elem);
        $ctrl._elem.style.zIndex = 20;
        $ctrl._elem.style.position = 'absolute';

        return true;
    }

    /**
    * Move element following the cursor
    *
    **/
    function onDragMove(event) {

        $ctrl._elemX = event.pageX - $ctrl._shiftX;
        $ctrl._elemY = event.pageY - $ctrl._shiftY;

        $ctrl._elem.style.left = $ctrl._elemX
            - $ctrl._margin
            + 'px';
        $ctrl._elem.style.top = $ctrl._elemY
            - $ctrl._margin
            + 'px';

        $ctrl._currentTargetElem = geometryService.getElementUnderClientXY($ctrl._elem, event.clientX, event.clientY);
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
