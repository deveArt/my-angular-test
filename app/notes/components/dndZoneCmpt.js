function DndZoneController($window, $document, $element, $timeout, $scope, $attrs) {
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
            top: overlayData.top + 'px',
            left: overlayData.left + 'px',
            width: overlayData.width + 'px',
            height: overlayData.height + 'px'
        });

        $element.append(overlayElement);
    };

    $ctrl.nolight = function() {
        var overlayElement = document.getElementById('dnd-overlay');
        angular.element(overlayElement).remove();
    };

    function init() {
        $element[0].mode = $ctrl.mode;
        window.myEl = $element;
console.dir($element);

        if ($ctrl.mode == 'drop') {
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
                dragStart();
            }

            onDragMove(e);

            var newDropTarget = findDropTarget();

            if (newDropTarget != $ctrl._dropTarget) {
                $ctrl._dropTarget && angular.element($ctrl._dropTarget).triggerHandler('dragleave');
                newDropTarget && angular.element(newDropTarget).triggerHandler('dropready');
            }

            $ctrl._dropTarget  = newDropTarget;
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
        $ctrl._elem.style.position = $ctrl.old.position;
        $ctrl._elem.style.left = $ctrl.old.left + 'px';
        $ctrl._elem.style.top = $ctrl.old.top + 'px';
        $ctrl._elem.style.zIndex = $ctrl.old.zIndex;
    }

    function dragEnd() {
        if ($ctrl._dropTarget == null) {
            return null;
        }
        console.log('drag end');
        $ctrl._dropTarget.appendChild($ctrl._elem);
        angular.element($ctrl._dropTarget).triggerHandler('dragleave');
    }

    function dragStart() {
        if (!$ctrl.dragTarget) {
            return;
        }
        console.log('drag start');

        // создать вспомогательные свойства shiftX/shiftY
        $ctrl._elem = $ctrl.dragTarget.dragElement[0];
        var coords = getCoords($ctrl._elem);
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
        $ctrl._elem.style.zIndex = 9999;
        $ctrl._elem.style.position = 'absolute';

//console.log($ctrl._shiftX, $ctrl._shiftY);
        // инициировать начало переноса

        return true;
    }

    function onDragMove(event) {
        $ctrl._elem.style.left = event.pageX - $ctrl._shiftX + 'px';
        $ctrl._elem.style.top = event.pageY - $ctrl._shiftY + 'px';

        $ctrl._currentTargetElem = getElementUnderClientXY($ctrl._elem, event.clientX, event.clientY);
    }

    function getCoords(elem) {
        // (1)
        var box = elem.getBoundingClientRect();

        var body = document.body;
        var docEl = document.documentElement;

        // (2)
        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        // (3)
        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;

        // (4)
        var top  = box.top +  scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;
        //console.log(box);console.log(clientTop);
        // (5)
        return { top: Math.round(top), left: Math.round(left) };
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

        while (elem != document && elem.mode !== 'drop') {
            elem = elem.parentNode;
        }

        if (elem == document) {
            return null;
        }
    //    console.dir(elem);
        return elem;
    }
}

angular
    .module('app')
    .component('dndZone', {
        controller: DndZoneController,
        bindings: {
            mode: '@'
        }
    });
