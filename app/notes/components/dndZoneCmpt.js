angular
    .module('app')
    .component('dndZone', {
        controller: DndZoneController,
        bindings: {
            mode: '@',
            onStart: '&',
            onEnd: '&'
        }
    });

/**
 *
 * Dnd zone controller
 * dnd flow manage
 *
 * @constructor
 */
function DndZoneController($document, $element, geomSvc) {
    var $ctrl = this;
    $ctrl.dragTarget = null;
    $ctrl._elem = null;

    $ctrl.$postLink = init;

    $ctrl.highlight = function() {
        var overlayData = $element[0].getBoundingClientRect();
        var overlayElement = angular.element('<div id="dnd-overlay"></div>').css({
            'background-color': '#7FFFD4',
            opacity: 0.5,
            position: 'absolute',
            width: overlayData.width + 'px',
            height: overlayData.height + 'px'
        });

        $element.append(overlayElement);
    };

    $ctrl.nolight = function() {
        var overlayElement = document.getElementById('dnd-overlay');
        angular.element(overlayElement).remove();
    };

	/**
     * Main setup listeners
     */
    function init() {
        $element[0].mode = $ctrl.mode;
        window.myEl = $element;

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

            var newDropTarget = findDropTarget();

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

            $ctrl.dragTarget = null; // ????????
            $ctrl._elem = null;
            $ctrl._dropTarget = null;
            $ctrl.old = null;
        });
    }

    function rollBack() {
        console.log('rollback');

        $ctrl.old.parent.insertBefore($ctrl._elem, $ctrl.old.nextSibling);

        var coords = geomSvc.getCoords($ctrl.old.parent);
        $ctrl._elem.style.position = $ctrl.old.position;
        $ctrl._elem.style.left = $ctrl.old.left - coords.left - $ctrl._margin + 'px';
        $ctrl._elem.style.top = $ctrl.old.top - coords.top - $ctrl._margin + 'px';
        $ctrl._elem.style.zIndex = $ctrl.old.zIndex;

        $ctrl.onEnd && $ctrl.onEnd();
    }

    function dragEnd() {
        if ($ctrl._dropTarget == null) {
            return null;
        }
        console.log('drag end');
        angular.element($ctrl._dropTarget).triggerHandler('dragleave');

        if ($ctrl._dropTarget.mode === 'trash') {
            angular.element($ctrl._elem).remove();
        } else {
            var coordsEl = geomSvc.getCoords($ctrl._elem);
            var coordsZone = geomSvc.getCoords($ctrl._dropTarget);
            var diffLeft = coordsZone.left - coordsEl.left + 10;
            var diffTop = coordsZone.top - coordsEl.top + 10;
            var diffRight = coordsZone.right - coordsEl.right - 10;
            var diffBottom = coordsZone.bottom - coordsEl.bottom - 10;

            var left = $ctrl._elemX - coordsZone.left - $ctrl._margin;
            var top = $ctrl._elemY - coordsZone.top - $ctrl._margin;

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

    function dragStart() {
        if (!$ctrl.dragTarget) {
            return;
        }
        console.log('drag start');

        // создать вспомогательные свойства shiftX/shiftY
        $ctrl._elem = $ctrl.dragTarget.dragElement[0];
        $ctrl._margin = parseInt(getComputedStyle($ctrl._elem, null).getPropertyValue('margin'));

        var coords = geomSvc.getCoords($ctrl._elem);
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

    function onDragMove(event) {

        $ctrl._elemX = event.pageX - $ctrl._shiftX;
        $ctrl._elemY = event.pageY - $ctrl._shiftY;

        $ctrl._elem.style.left = $ctrl._elemX
            - $ctrl._margin
            + 'px';
        $ctrl._elem.style.top = $ctrl._elemY
            - $ctrl._margin
            + 'px';

        $ctrl._currentTargetElem = getElementUnderClientXY($ctrl._elem, event.clientX, event.clientY);
    }

    function getElementUnderClientXY(elem, clientX, clientY) {
        var display = elem.style.display || '';
        elem.style.display = 'none';

        var target = document.elementFromPoint(clientX, clientY);

        elem.style.display = display;

        if (!target || target == document) { // это бывает при выносе за границы окна
            target = document.body;
        }

        return target;
    }

    function findDropTarget() {
        if (!$ctrl._currentTargetElem) {
            return null;
        }

        var elem = $ctrl._currentTargetElem;

        while (elem != document && elem.mode !== 'drop' && elem.mode !== 'trash') {
            elem = elem.parentNode;
        }

        if (elem == document) {
            return null;
        }

        return elem;
    }
}
