var injectParams = [];

function geometryService() {

    /**
    * Get geometry values of the element
    *
    **/
    this.getCoords = function(elem) {
        var box = elem.getBoundingClientRect();

        var body = document.body;
        var docEl = document.documentElement;

        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;

        var top  = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;
        var right = box.right + scrollLeft - clientLeft;
        var bottom = box.bottom + scrollTop - clientTop;

        return {
            top: Math.round(top),
            left: Math.round(left),
            right: Math.round(right),
            bottom: Math.round(bottom),
            width: box.width,
            height: box.height
        };
    };

    /**
    * Find target under cursor
    *
    **/
    this.getElementUnderClientXY = function(elem, clientX, clientY) {
        var display = elem.style.display || '';
        elem.style.display = 'none';

        var target = document.elementFromPoint(clientX, clientY);

        elem.style.display = display;

        if (!target || target == document) { // это бывает при выносе за границы окна
            target = document.body;
        }

        return target;
    };
}

geometryService.$inject = injectParams;
angular.module('app').service('geomSvc', geometryService);
