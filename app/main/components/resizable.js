angular
    .module('app')
    .component('resizable', {
        controller: ResizableController
    });

function ResizableController($element, $document, geomSvc) {
    var $ctrl = this;

    $ctrl.$postLink = init;
    $ctrl.active = false;

    function init() {
        $ctrl._elem = $element.children()[0];
        $ctrl.$elem = angular.element($ctrl._elem);

        $element.on('mouseenter', function (e) {
            showControls(e);
        });

        $element.on('mouseleave mousedown', function (e) {
            removeControls();
        });

        $document.on('mousemove', function (e) {
            if (!$ctrl.active || !$ctrl._elem) {
                return;
            }

            var css = {
                width: e.pageX + $ctrl.stWidth - $ctrl.cornerSX + 'px',
                height: e.pageY + $ctrl.stHeight - $ctrl.cornerSY + 'px'
            };

            $ctrl.$elem.css(css);
            $element.css(css);
        });

        $document.on('mouseup', function (e) {
            removeControls();
            $ctrl.active = false;
        });
    }

    function showControls(e) {

        var overlayElement = angular.element('<div class="resize-control" data-mode="resize-corner"></div>');

        overlayElement.on('mousedown', function (event) {
            $ctrl.active = true;

            var position = geomSvc.getCoords($ctrl._elem);

            $ctrl.stWidth = position.width;
            $ctrl.stHeight = position.height;

            $ctrl.cornerSX = event.pageX;
            $ctrl.cornerSY = event.pageY;

            event.stopPropagation();
        });

        $element.append(overlayElement);

    }

    function removeControls() {
        var resizeElements = document.getElementsByClassName('resize-control');
        angular.element(resizeElements).remove();
    }

}
