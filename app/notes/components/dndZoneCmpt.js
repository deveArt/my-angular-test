function DndZoneController($window, $document, $element, $timeout, $scope, $attrs) {
    var $ctrl = this;
    $ctrl.dragElement = null;
    $ctrl.startX = null;
    $ctrl.startY = null;
    $ctrl._elem = null;

    $ctrl.$postLink = init;

    function init() {
        $document.on('mousemove', function (e) {
            if (!$ctrl.dragElement) {
                return;
            }

            if (Math.abs(e.pageX - $ctrl.startX) < 3 && Math.abs(e.pageY - $ctrl.startY) < 3) {
                return;
            }

            if ( $ctrl._elem === null ) {
                dragStart();
            }

            onDragMove(e);
        });
    }

    function dragStart() {
        if (!$ctrl.dragElement) {
            return;
        }

        $ctrl._elem = $ctrl.dragElement[0].cloneNode(true);

        document.body.appendChild( $ctrl._elem);
        $ctrl._elem.style.zIndex = 9999;
        $ctrl._elem.style.position = 'absolute';

        // создать вспомогательные свойства shiftX/shiftY
        var coords = getCoords($ctrl.dragElement[0]);
        $ctrl._shiftX = $ctrl.startX - coords.left;
        $ctrl._shiftY = $ctrl.startY - coords.top;

console.log($ctrl._shiftX, $ctrl._shiftY);
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
        console.log(box);console.log(clientTop);
        // (5)
        return { top: Math.round(top), left: Math.round(left) };
    }

    function getElementUnderClientXY(elem, clientX, clientY) {
        var display = elem.style.display || '';
        elem.style.display = 'none';

        var target = document.elementFromPoint(clientX, clientY);

        elem.style.display = display;

        if (!target || target == document) { // это бывает при выносе за границы окна
            target = document.body; // поправить значение, чтобы был именно элемент
        }

        return target;
    }
}

angular
    .module('app')
    .component('dndZone', {
        controller: DndZoneController,
        bindings: {
            mode: '<'
        }
    });
