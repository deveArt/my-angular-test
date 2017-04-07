angular
    .module('app')
    .component('resizable', {
        controller: ResizableController
    });

function ResizableController($element, $document, geomSvc) {
    var $ctrl = this;

    $ctrl.$postLink = init;
    $ctrl.maxHeightIn = null;
    $ctrl.maxWidthIn = null;
    $ctrl.active = false;

    function init() {
        $ctrl._elem = $element.children()[0];
        $ctrl.$elem = angular.element($ctrl._elem);

        $element.on('mouseenter', function (e) {
            showControls();
        });

        $element.on('mouseleave mousedown', function (e) {
            removeControls();
        });

        $document.on('mousemove', function (e) {
            if (!$ctrl.active || !$ctrl._elem) {
                return;
            }

            var position = geomSvc.getCoords($ctrl._elem);
           // var margin = parseInt($ctrl.$elem.css('margin'));

            var css = {
                width: e.pageX - position.left + 10 + 'px', // @todo убрать хардкод
                height: e.pageY - position.top + 10 + 'px'
            };

            $ctrl.$elem.css(css);
            $element.css(css);
        });

        $document.on('mouseup', function (e) {
            removeControls();
            clearSize();
            $ctrl.active = false;
        });
    }

    function showControls() {
        getMaxSize($element[0]);

        var overlayElement = angular.element('<div class="resize-control" data-mode="resize-corner"></div>');

        overlayElement.on('mousedown', function (e) {
            $ctrl.active = true;
        });

        $element.append(overlayElement);
    }

    function removeControls() {
        var resizeElements = document.getElementsByClassName('resize-control');
        angular.element(resizeElements).remove();
    }

    function getMaxSize(elem) {
        var posData = elem.getBoundingClientRect();

        if ($ctrl.maxWidthIn === null || posData.width > $ctrl.maxWidthIn) {
            $ctrl.maxWidthIn = posData.width;
        }

        if ($ctrl.maxHeightIn === null || posData.height > $ctrl.maxHeightIn) {
            $ctrl.maxHeightIn = posData.height;
        }

        if (elem.children.length !== 0) {
            angular.forEach(elem.children, function (chEl) {
                getMaxSize(chEl);
            });
        }
    }

    function clearSize() {
        $ctrl.maxHeightIn = null;
        $ctrl.maxWidthIn = null;
    }
}
